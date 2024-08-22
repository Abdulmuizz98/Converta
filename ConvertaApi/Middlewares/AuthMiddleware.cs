using System.Text.Json;
using FirebaseAdmin.Auth;

namespace ConvertaApi.MiddleWares;



public class AuthMiddleware(RequestDelegate next)
{
    public async Task InvokeAsync(HttpContext context)
    {
        Console.WriteLine("This is in invoke async.");
        // Get the Authorization header from the request
        var authHeader = context.Request.Headers["Authorization"].ToString() ?? "";
        var apiKeyHeader  = context.Request.Headers["X-API-KEY"].ToString() ?? "";
        var apiServiceHeader = context.Request.Headers["X-API-SERVICE"].ToString() ?? "";
        
        var idTokenParts = authHeader.Split("Bearer ");
        var idToken = idTokenParts.Length > 1 ? idTokenParts[1] : "";
        var isIdTokenAuth = false;

        Console.WriteLine(idTokenParts);
        Console.WriteLine(idToken);

        // Check if the request is authorized
        if (!authHeader.StartsWith("Bearer ") && !apiKeyHeader.StartsWith("Bearer "))
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsync(JsonSerializer.Serialize(new { error = "Unauthorized: Authorization header or X-API-KEY header with Bearer token is required" })); 
            return;
        }

        try{
            Console.WriteLine("This is in try");
            UserRecord? userProfile = null;
            if (!String.IsNullOrWhiteSpace(idToken))
            {
                // Verify idToken
                Console.WriteLine("Seems idToken is provided");
                // Verify Firebase ID token
                FirebaseToken decodedToken = await FirebaseAuth.DefaultInstance.VerifyIdTokenAsync(idToken);
                Console.WriteLine("Decoded token is: ", decodedToken.Uid);
                // Fetch full user profile
                userProfile = await FirebaseAuth.DefaultInstance.GetUserAsync(decodedToken.Uid);
                isIdTokenAuth = true;

            } else {
                // Verify API key
                var apiKeyParts = apiKeyHeader.Split("Bearer ");
                var apiKey = apiKeyParts.Length > 1 ? apiKeyParts[1] : "";

                userProfile = await verifyApiKey(apiKey, apiServiceHeader);

                if (userProfile is null) {
                    context.Response.StatusCode = 403;
                    await context.Response.WriteAsync(JsonSerializer.Serialize(new { error = "Forbidden: Invalid API key" }));
                    return;
                }
            }

            context.Items["UserProfile"] = userProfile; // Attach full user profile to request object
            context.Items["isIdTokenAuth"] = isIdTokenAuth; // Attach auth type to request object

        }catch(Exception e){
            Console.WriteLine(e.Message);
            context.Response.StatusCode = 403;
            await context.Response.WriteAsync(JsonSerializer.Serialize(new { error = "Forbidden: Invalid token or API key" }));
            return;
        }

        await next(context);
    }

    public async Task<UserRecord?> verifyApiKey(string apiKey, string apiService)
    {
        try {
            if (String.IsNullOrWhiteSpace(apiKey)) return null;
            
            var uid = apiKey.Split("::")[1];
            Console.WriteLine(uid);
            // Fetch user by UID (assuming API key is stored as a custom claim)
            UserRecord? userRecord = await FirebaseAuth.DefaultInstance.GetUserAsync(uid);
            
            var customClaims = userRecord.CustomClaims;
            string key = "converta-apikey"; 
            // Check if the custom claims contain the provided API key
            return (customClaims != null && customClaims.TryGetValue(key, out object? ccKey) && ccKey != null && ccKey.Equals(apiKey))
            ? userRecord
            : null;
        } catch (Exception error) {
            Console.WriteLine("Error verifying API key:", error.Message);
            return null; // Return false if there's an error or if API key doesn't match
        }

    }
}