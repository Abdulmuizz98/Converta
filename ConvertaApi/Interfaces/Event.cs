namespace ConvertaApi.Interfaces;

public interface IEvent
{
    // Define method to send payload to conversion API
    string GeneratePayload();
}

