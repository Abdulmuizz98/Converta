using Microsoft.AspNetCore.Mvc;
using ConvertaApi.Models;
using ConvertaApi.Services;
using FirebaseAdmin.Auth;

namespace ConvertaApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class MetaEventController : ControllerBase
    {
        private readonly ConvertaService _convertaService;

        public MetaEventController(ConvertaService convertaService)
        {
            _convertaService = convertaService;
        }

        // GET: api/MetaEvent
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MetaEvent>>> GetMetaEvent()
        {
            return await _convertaService.GetItems<MetaEvent>();
        }

        // GET: api/MetaEvent/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MetaEvent>> GetMetaEvent(Guid id)
        {
            var metaEvent = await _convertaService.GetItem<MetaEvent>(id);

            if (metaEvent == null)
            {
                return NotFound();
            }

            return Ok(metaEvent);
        }

        // POST: api/MetaEvent
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<MetaEvent>> PostMetaEvent([FromBody] MetaEventBase newMetaEvent , [FromQuery] MetaEventQP queryParams)
        {
            bool isOnline = queryParams.isOnline, isConverted = queryParams.isConverted, isRevisit = false;
            string accessToken = queryParams.accessToken;

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            UserRecord userProfile = (UserRecord) HttpContext.Items["UserProfile"]!;
            
            if (await UserOwnsPixel(userProfile.Uid, newMetaEvent.PixelId) == false)
                return BadRequest("User does not own the pixel.");

            Lead? lead = await _convertaService.GetItem<Lead>(l => l.Id == newMetaEvent.LeadId && l.PixelId == newMetaEvent.PixelId);

            // this is where we work
            if(!isOnline) // if event is created by an offline lead
            {
                isRevisit = await HandleIsOfflineLeadEvent(newMetaEvent);
            }
            else // if event is created by an online lead (could also be a new lead, maybe he just signed up)
            {
                // if isConverted is true, then the leadId in payload exists for the ad (is a revisit)
                if(isConverted)
                {
                    isRevisit = true;
                }
                else // otherwise, if isConverted is false, 2 scenarios
                {
                    if (lead is not null) 
                    {   // 1. if leadId related to the ad is in database, its a revisit but was A previous offline user 
                        isRevisit = true;
                    }
                    else 
                    {   // 2. if leadId related to the ad is not in db - create a new lead id related to the ad id
                        lead = BaseToLead(newMetaEvent);
                        await _convertaService.AddItem<Lead>(lead);

                        isRevisit = false;
                    }
                 
                    // (update their user info payloads) isConverted
                    lead!.IsConverted = true;

                }
            }

            if (newMetaEvent.UserData is not null && lead is not null) UpdateLeadFromUserData(lead, newMetaEvent.UserData);


            bool isUpdated = await _convertaService.UpdateItemWithRetry<Lead>(lead!, 3);
            if (!isUpdated) return BadRequest("Failed to update lead info after 3 trials. Please try again.");
            
            MetaEvent metaEvent = BaseToMetaEvent(newMetaEvent, isRevisit);
            await _convertaService.AddItem<MetaEvent>(metaEvent);

            MetaEventDataDTO dataDto = MetaEventToDataDTO(metaEvent);

            // Make Post request to Meta submit the event;
            // Console.WriteLine(metaEvent.GeneratePayload());
            await _convertaService.SendMetaEventPayloadWithRetry(dataDto.GeneratePayload(), metaEvent.PixelId, accessToken, 3);

            return CreatedAtAction("GetMetaEvent", new { id = metaEvent.Id }, metaEvent);
        }

        private static MetaEvent BaseToMetaEvent(MetaEventBase metaEvent, bool isRevisit)
        {
            var id = Guid.NewGuid();

            metaEvent.UserData.MetaEventId = id;

            if (metaEvent.CustomData is not null)
                metaEvent.CustomData.MetaEventId = id;

            return new() {
                Id = id,
                isRevisit = isRevisit,

                Time = metaEvent.Time,
                Name = metaEvent.Name,
                SourceUrl = metaEvent.SourceUrl,
                ActionSource = metaEvent.ActionSource,
                CustomData = metaEvent.CustomData,
                UserData = metaEvent.UserData,
                PixelId = metaEvent.PixelId,
                LeadId = metaEvent.LeadId,
                CustomerId = metaEvent.CustomerId,
            };
        }

        private static MetaEventDataDTO MetaEventToDataDTO(MetaEvent metaEvent)
        {
            MetaEventDTO meDTO =  new() {
                Time = metaEvent.Time,
                Name = metaEvent.Name,
                SourceUrl = metaEvent.SourceUrl,
                ActionSource = metaEvent.ActionSource,
                CustomData = metaEvent.CustomData,
                UserData = metaEvent.UserData,
            };
            
            HashSensitive(meDTO);

            return new (){
                Data = [meDTO]
            };
        }

        private static void HashSensitive(MetaEventDTO meDto){

            var emails = meDto.UserData.Email;
            var phones = meDto.UserData.Phone;

            if (emails is not null)
                for (int i = 0; i < emails.Count; i++)
                    emails[i] = MetaEventDataDTO.ComputeSha256Hash(emails[i]);

            if (phones is not null)
                for (int i = 0; i < phones.Count; i++)
                    phones[i] = MetaEventDataDTO.ComputeSha256Hash(phones[i]);
        }

        private static Lead BaseToLead(MetaEventBase metaEvent) => new()
        {
            Id = metaEvent.LeadId,
            PixelId = metaEvent.PixelId,
            CustomerId = metaEvent.CustomerId,
            IsConverted = false
        };

        private static void UpdateLeadFromUserData(Lead lead, UserData userData) {
            if (userData.Email is not null)
            {
                lead.Email ??= [];
                HashSet<string> uniqueEmail = new(lead.Email);
                foreach (var email in userData.Email)
                    uniqueEmail.Add(email);
                lead.Email = [.. uniqueEmail];
            }

            if (userData.Phone is not null)
            {
                lead.Phone ??= [];
                HashSet<string> uniquePhone = new(lead.Phone);
                foreach (var phone in userData.Phone)
                    uniquePhone.Add(phone);
                lead.Phone = [.. uniquePhone];
            }

            if (userData.IPAddress is not null)
            {
                lead.IPAddress ??= [];
                HashSet<string> uniqueIP = new(lead.IPAddress)
                {
                    userData.IPAddress
                };
                lead.IPAddress = [.. uniqueIP];
            }
            
            if (userData.UserAgent is not null)
            {
                lead.UserAgent ??= [];
                HashSet<string> uniqueUA = new(lead.UserAgent)
                {
                    userData.UserAgent
                };
                lead.UserAgent = [.. uniqueUA];
            }

        }

        private async Task<bool> HandleIsOfflineLeadEvent(MetaEventBase newMetaEvent) {
            // Check if its a revisiting offline lead (of the particular ad)
            bool isRevisit = await _convertaService.ItemExists<Lead>(l => l.Id == newMetaEvent.LeadId && l.PixelId == newMetaEvent.PixelId);

            if(!isRevisit) // if its a new offline lead
            {
                Console.WriteLine($"\nLeadID: , {newMetaEvent.LeadId} \nPixelID: , {newMetaEvent.PixelId}");
                Lead lead = BaseToLead(newMetaEvent);
                await _convertaService.AddItem<Lead>(lead);
            }

            return isRevisit;
        }

        private async Task<bool> UserOwnsPixel(string userId, string pixelId)
        {
            return await _convertaService.ItemExists<Pixel>(p => p.Id == pixelId && p.UserId == userId);
        }
    }
}
