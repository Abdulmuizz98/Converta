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

    }

}
