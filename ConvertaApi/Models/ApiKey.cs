using System.ComponentModel.DataAnnotations;
public enum ServiceIdType{
    converta
}

public enum ServicePropType{
    apiKey
}

public class ApiKeyRequestBody
{
    [EnumDataType(typeof(ServiceIdType))]
    public string ServiceId { get; set; }
}