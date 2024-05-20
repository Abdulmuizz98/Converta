using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using ConvertaApi.Models;
using ConvertaApi.Services;

namespace ConvertaApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Produces("application/json")]
    public class PixelController : ControllerBase
    {
        private readonly ConvertaService _convertaService;

        public PixelController(ConvertaService convertaService)
        {
            _convertaService = convertaService;
        }

        // GET: api/Pixel
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Pixel>>> GetPixels()
        {
            return await _convertaService.GetItems<Pixel>();
        }
        
        // GET: api/Pixel/userId
        [HttpGet("pixelId")]
        public async Task<ActionResult<IEnumerable<MetaEvent>>> GetPixelsByUserId([FromQuery] string pixelId)
        {
            if (string.IsNullOrWhiteSpace(pixelId))
            {
                return BadRequest("PixelId parameter is required");
            }

            return await _convertaService.GetItems<MetaEvent>(me => me.PixelId == pixelId);
        }

 
        // GET api/pixel/{pixelId}/metaEvents
        [HttpGet("{pixelId}/metaEvents")]
        public async Task<ActionResult<IEnumerable<MetaEvent>>> GetMetaEventByPixelId(string pixelId)
        {
            if (await PixelExists(pixelId) == false)
            {
                return NotFound("Pixel not found");
            }

            return await _convertaService.GetItems<MetaEvent>(me => me.PixelId == pixelId);
        }

        // GET: api/Pixel/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Pixel>> GetPixel(string id)
        {
            var px = await _convertaService.GetItem<Pixel>(id);

            if (px == null)
            {
                return NotFound();
            }

            return px;
        }

        // POST: api/Pixel
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Pixel>> PostPixel(Pixel newPixel)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Pixel px = BaseToPixel(newPixel);

            await _convertaService.AddItem<Pixel>(newPixel);

            return CreatedAtAction(nameof(GetPixel), new { id = newPixel.Id }, newPixel);
        }

        // DELETE: api/Pixel/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePixel(Guid id)
        {
            var px = await _convertaService.GetItem<Pixel>(id);

            if (PixelExists == null)
            {
                return NotFound();
            }

            await _convertaService.DeleteItem<Pixel>(px);

            return NoContent();
        }

        private async Task<bool> PixelExists(string id)
        {
            return await _convertaService.ItemExists<Pixel>(px => px.Id == id);
        }
    }
}
