using System.Text.Json.Serialization;


namespace ConvertaApi.Models;

public class UserData
{
    [JsonPropertyName("em")]
    public List<string>? Email { get; set; } // Hash
    [JsonPropertyName("ph")]
    public List<string>? Phone { get; set; } // Hash
    [JsonPropertyName("client_user_agent")]
    public string? UserAgent { get; set; } // Do not Hash
    [JsonPropertyName("client_ip_address")]
    public string? IPAddress { get; set; } // Do not Hash

    // Navigation Properties
    [JsonIgnore]
    public Guid MetaEventId { get; set; } //Primary Key and Foreign Key
    // public MetaEvent MetaEvent {get; set;}
}
