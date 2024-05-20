using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Newtonsoft.Json;
// using Newtonsoft.Json.Serialization;

namespace ConvertaApi.Models;


public enum PixelType{
    Ad,
    Campaign
}


public class Pixel
{
    [JsonPropertyName("id")]
    public string Id { get; set; }
    [JsonPropertyName("name")]
    public string Name { get; set; }
    public string? Description {get; set;}
    public string AccessToken {get; set;}

    // [JsonPropertyName("pixel_type")]
    [EnumDataType(typeof(PixelType))]
    public string PixelType { get; set; }


    // Navigation Properties

    // [JsonPropertyName("user_id")]
    public string UserId { get; set; } // Required User foreign key property
    // public User User { get; set; } = null!; // Required reference navigation to User

    // public ICollection<Lead> Leads {get;} = []; // Collection navigation for Lead
    // public ICollection<MetaEvent> MetaEvents {get;} = []; // Collection navigation for MetaEvent

}