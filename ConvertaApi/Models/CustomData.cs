using System.Text.Json.Serialization;

namespace ConvertaApi.Models;

public class CustomData
{
    // [JsonPropertyName("value")]
    public decimal? Value { get; set; }
    // [JsonPropertyName("currency")]
    public string? Currency { get; set; }

    // Navigation Properties

    [JsonIgnore]
    public Guid MetaEventId { get; set; } //Primary Key and Foreign Key
    // public MetaEvent MetaEvent {get; set;}
}
