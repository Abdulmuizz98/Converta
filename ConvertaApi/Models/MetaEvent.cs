using ConvertaApi.Interfaces;
// using Newtonsoft.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Security.Cryptography;
using System.ComponentModel.DataAnnotations;
using System.Text;

// using Newtonsoft.Json.Converters;

namespace ConvertaApi.Models;


public enum MetaEventType {
    Purchase, //likely email and phone
    AddToCart, //not likely email and phone
    AddPaymentInfo, //likely email and phone
    GenerateLead, //likely email and phone
    CompleteRegistration, //likely email and phone
    Contact, //likely email and phone
    CustomizeProduct, //not likely email and phone
    Donate, //likely email and phone
    FindLocation, //not likely email and phone
    Schedule,
    StartTrial,
    SubmitApplication,
    Subscribe,
    ViewContent,
    Search

}
public class MetaEvent: MetaEventBase, IEvent
{
    //  [JsonPropertyName("id")]
    public Guid Id { get; set; } // Primary Key
    //  [JsonPropertyName("is_revisit")]
    public bool isRevisit { get; set; }// TODO: Implement logic to check if event is by a new Lead




    // Generate payload for conversion API
    public string GeneratePayload()
    {
        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
            WriteIndented = true
        };
        return JsonSerializer.Serialize(this, options);
        //         {
        //     "data": [
        //         {
        //             "event_name": "Purchase",
        //             "event_time": 1710512103,
        //             "action_source": "website",
        //             "user_data": {
        //                 "em": [
        //                     "7b17fb0bd173f625b58636fb796407c22b3d16fc78302d79f0fd30c2fc2fc068"
        //                 ],
        //                 "ph": [
        //                     null
        //                 ],
        //                 "client_ip_address": null,
        //                 "client_user_agent": null
        //             },
        //             "custom_data": {
        //                 "currency": "USD",
        //                 "value": "142.52"
        //             }
        //         }
        //     ]
        // }


// {
//     "Id":"12517f40-81b5-4d24-b6b4-cb5aee8dce85",
//     "isRevisit":true,
//     "CreatedAt":"2024-03-17T14:43:53.235Z",
//     "Name":"Purchase",
//     "SourceUrl":"string",
//     "ActionSource":"string",
//     "CustomData":{
//         "Value":0.0,
//         "Currency":"string",
//         "MetaEventId":"12517f40-81b5-4d24-b6b4-cb5aee8dce85"
//     },
//     "UserData":{
//         "Email":["string"],
//         "Phone":["string"],
//         "UserAgent":"string",
//         "IPAddress":"string",
//         "MetaEventId":"12517f40-81b5-4d24-b6b4-cb5aee8dce85"
//     },
//     "PixelId":"7613402098672129",
//     "LeadId":"3fa85f64-5717-4562-b3fc-2c963f66afa6"
// }

    }

}

public class MetaEventBase
{
    [JsonPropertyName("event_time")]
    public int Time {get; set;} 

    [EnumDataType(typeof(MetaEventType))]
    [JsonPropertyName("event_name")]
    public string Name { get; set; }
    [JsonPropertyName("event_source_url")]
    public string SourceUrl { get; set; }
    // [JsonPropertyName("action_source")]
    public string ActionSource { get; set; }
    // [JsonPropertyName("custom_data")]
    public CustomData? CustomData {get; set;}
    // [JsonPropertyName("user_data")]
    public UserData UserData {get; set;}
    public string? CustomerId {get; set;}
    public string PixelId {get; set;}
    public Guid LeadId {get; set;}

}

public class MetaEventDTO // Prep DTO for sending event to metas endpoint
{
    [JsonPropertyName("event_time")]
    public int Time {get; set;} 

    [EnumDataType(typeof(MetaEventType))]
    [JsonPropertyName("event_name")]
    public string Name { get; set; }
    [JsonPropertyName("event_source_url")]
    public string SourceUrl { get; set; }
    // [JsonPropertyName("action_source")]
    public string ActionSource { get; set; }
    // [JsonPropertyName("custom_data")]
    public CustomData? CustomData {get; set;}
    // [JsonPropertyName("user_data")]
    public UserData UserData {get; set;}
}

public class MetaEventDataDTO // DTO acctually sending Event to metas endpoint
{
    // private JsonSerializerOptions options;

    public List<MetaEventDTO> Data {get; set;}
    public string GeneratePayload () {
        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower,
            WriteIndented = true
        };
        return JsonSerializer.Serialize(this, options);
    }
    public static string ComputeSha256Hash(string rawData)
    {
        // Convert the input string to a byte array and compute the hash.
        using (SHA256 sha256Hash = SHA256.Create())
        {
            byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));

            // Convert byte array to a string.
            StringBuilder builder = new ();
            for (int i = 0; i < bytes.Length; i++)
            {
                builder.Append(bytes[i].ToString("x2")); // Convert byte to hexadecimal representation.
            }
            return builder.ToString();
        }
    }
}

public class MetaEventQP //Meta Event Query Params
{
    public bool isConverted {get; set;}
    public bool isOnline {get; set;}
    public string accessToken {get; set;}
}