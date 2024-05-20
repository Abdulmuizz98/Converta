using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConvertaApi.Models;
using ConvertaApi.Data;
using ConvertaApi.Services;

namespace ConvertaApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class LeadController : ControllerBase
    {
        private readonly ConvertaService _convertaService;

        public LeadController(ConvertaService convertaService)
        {
            _convertaService = convertaService;
        }

        // GET: api/Lead
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Lead>>> GetLead()
        {
            return await _convertaService.GetItems<Lead>();
        }

        // GET: api/Lead/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Lead>> GetLead(Guid id)
        {
            var lead = await _convertaService.GetItem<Lead>(id);

            if (lead == null)
            {
                return NotFound();
            }

            return lead;
        }

        // GET: api/Lead/LeadsByPixelAndCustomerId?pixelId={pixelId}&customerId={customerId}
        [HttpGet("LeadsByPixelAndCustomerId")]
        public async Task<ActionResult<Lead>> GetLeadByPixelAndCustomerId([FromQuery] string pixelId, [FromQuery] string customerId)
        {
         
            // Retrieve the lead associated with the specified pixel ID and customer ID
            var lead = await _convertaService.GetItem<Lead>(l => l.PixelId == pixelId && l.CustomerId == customerId);
            
            if (lead == null)
            {
                return NotFound();
            }

            return lead;
        }

        // GET: api/Lead
        // [HttpGet]
        // public async Task<ActionResult<Lead>> GetLead([FromQuery] Guid? id = null, [FromQuery] string? email = null)
        // {
        //     if (id.HasValue)
        //     {
        //         var leadById = await _convertaService.GetItem<Lead>(id.Value);
        //         if (leadById != null)
        //         {
        //             return leadById;
        //         }
        //     }

        //     if (!string.IsNullOrWhiteSpace(email))
        //     {
        //         var leadByEmail = await _convertaService.GetItem<Lead>(l => l.Email != null && l.Email.Contains(email));
        //         if (leadByEmail != null)
        //         {
        //             return leadByEmail;
        //         }
        //     }

        //     return NotFound();
        // }


        // PUT: api/Lead/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        // [HttpPut("{id}")]
        // public async Task<IActionResult> PutLead(Guid id, Lead lead)
        // {
        //     if (id != lead.Id)
        //     {
        //         return BadRequest();
        //     }

        //     try
        //     {
        //         await _convertaService.UpdateItem<Lead>(lead);
        //     }
        //     catch (DbUpdateConcurrencyException)
        //     {
        //         if (! await LeadExists(id))
        //         {
        //             return NotFound();
        //         }
        //         else
        //         {
        //             throw;
        //         }
        //     }

        //     return NoContent();
        // }

        // POST: api/Lead
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        // [HttpPost]
        // public async Task<ActionResult<Lead>> PostLead(LeadBase newLead)
        // {
        //     if (!ModelState.IsValid)
        //         return BadRequest(ModelState);
            
        //     Lead lead = BaseToLead(newLead);

        //     _context.Lead.Add(lead);
        //     await _context.SaveChangesAsync();

        //     return CreatedAtAction(nameof(GetLead), new { id = lead.Id }, lead);
        // }

        // DELETE: api/Lead/5
        // [HttpDelete("{id}")]
        // public async Task<IActionResult> DeleteLead(Guid id)
        // {
        //     var lead = await _convertaService.GetItem<Lead>(id);
        //     if (lead == null)
        //     {
        //         return NotFound();
        //     }

        //     await _convertaService.DeleteItem<Lead>(lead);

        //     return NoContent();
        // }

        // private async Task<bool> LeadExists(Guid id)
        // {
        //     return await _convertaService.ItemExists<Lead>(lead => lead.Id == id);
        // }

        // private static Lead BaseToLead(LeadBase lead) => new ()
        // {
        //     Id = Guid.NewGuid(),
        //     AdId = lead.AdId,
        //     Email = lead.Email,
        //     Phone = lead.Phone,
        //     CustomerId = lead.CustomerId,
        // };

    }

}
