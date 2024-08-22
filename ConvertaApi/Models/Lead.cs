using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
// using Newtonsoft.Json;

namespace ConvertaApi.Models;

public class Lead
{
    // [JsonPropertyName("id")]
    public Guid Id { get; set; } // Primary Key
    // [JsonPropertyName("is_converted")]
    public string? CustomerId { get; set; } // Customer Id
    public bool IsConverted { get; set; } // Signed in or not
    [JsonPropertyName("em")]
    public List<string>? Email { get; set; } // Hash
    [JsonPropertyName("ph")]
    public List<string>? Phone { get; set; } // Hash
    [JsonPropertyName("client_user_agent")]
    public List<string>? UserAgent { get; set; } // Do not Hash
    [JsonPropertyName("client_ip_address")]
    public List<string>? IPAddress { get; set; } // Do not Hash


    // Navigation Properties
    public string PixelId {get; set;} // Required Pixel foreign key property
}