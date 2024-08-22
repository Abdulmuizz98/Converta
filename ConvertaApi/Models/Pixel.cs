using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace ConvertaApi.Models;


public enum PixelType{
    Ad,
    Campaign
}


public class PixelBase
{
    [JsonPropertyName("id")]
    public string Id { get; set; }
    [JsonPropertyName("name")]
    public string Name { get; set; }
    public string? Description {get; set;}
    public string AccessToken {get; set;}

    [EnumDataType(typeof(PixelType))]
    public string PixelType { get; set; }
}

public class Pixel: PixelBase
{
    public string UserId { get; set; }

}