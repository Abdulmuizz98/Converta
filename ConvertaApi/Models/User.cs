using System.Text.Json.Serialization;


namespace ConvertaApi.Models;

public class User
{
    // [JsonPropertyName("id")]
    public string Id { get; set; } //Primary Key

    // Navigation Properties
    // [JsonPropertyName("pixels")]
    // public ICollection<Pixel> Pixels { get;} = []; // Collection navigation for Pixel
}
