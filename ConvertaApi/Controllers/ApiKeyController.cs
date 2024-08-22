using Microsoft.AspNetCore.Mvc;
using FirebaseAdmin.Auth;

namespace ConvertaApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class ApiKeyController : ControllerBase
    {
        // GET: api/Apikey/serviceId
        [HttpGet("{serviceId}")]
        public IActionResult GetApikey(string serviceId)
        {
            if (string.IsNullOrWhiteSpace(serviceId))
                return BadRequest("UserId parameter is required");
            
            serviceId = serviceId.ToLower();
            
            var isIdTokenAuth =  (bool) HttpContext.Items["isIdTokenAuth"]!;
            if (!isIdTokenAuth) 
                return Unauthorized("Unauthorized: Valid IdToken required.");
            
            // Get user custom claims
            UserRecord userProfile = (UserRecord) HttpContext.Items["UserProfile"]!;
            var apikey  = userProfile.CustomClaims[$"{serviceId}-apikey"].ToString();

            if (String.IsNullOrWhiteSpace(apikey))
                return NotFound();
            
            return Ok(new{ apikey, serviceId });
        }
      
        // POST: api/Apikey
        [HttpPost]
        public IActionResult CreateApikey([FromBody] ApiKeyRequestBody reqBody)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            
            var isIdTokenAuth =  (bool) HttpContext.Items["isIdTokenAuth"]!;
            if (!isIdTokenAuth) 
                return Unauthorized("Unauthorized: Valid IdToken required.");

            try{
                // Get user custom claims
                UserRecord userProfile = (UserRecord) HttpContext.Items["UserProfile"]!;
                
                var newApiKey = $"{Guid.NewGuid().ToString()}::{userProfile.Uid}"; 
                SetServicePropForUser(reqBody.ServiceId, ServicePropType.apiKey, newApiKey);   
                        
                return CreatedAtAction(nameof(CreateApikey), new { apikey = newApiKey, serviceId = reqBody.ServiceId});
            }catch(Exception ){
                return StatusCode(500, "Failed to create new api key. Try again!"); 
            }
        }   

        private async void SetServicePropForUser(String serviceId, ServicePropType property, String value)
        {
            UserRecord userProfile = (UserRecord) HttpContext.Items["UserProfile"]!;

            // Check if Customer Claims exist
            var customClaims = userProfile.CustomClaims?.ToDictionary(i => i.Key, i => i.Value) ?? new Dictionary<String, object>();
            customClaims[$"{serviceId}-{property.ToString().ToLower()}"] = value;
    
            await FirebaseAuth.DefaultInstance.SetCustomUserClaimsAsync(userProfile.Uid, customClaims);
        } 
    }
}