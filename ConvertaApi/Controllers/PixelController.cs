using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FirebaseAdmin.Auth;

using ConvertaApi.Models;
using ConvertaApi.Services;
using Microsoft.AspNetCore.Authorization;

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
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<Pixel>>> GetAllPixels()
        {
            return await _convertaService.GetItems<Pixel>();
        }
        
        // GET: api/Pixel/user/userId
        [HttpGet("mine")]
        public async Task<ActionResult<IEnumerable<Pixel>>> GetUserPixels()
        {
            UserRecord userProfile = (UserRecord) HttpContext.Items["UserProfile"]!;
            return await _convertaService.GetItems<Pixel>(me => me.UserId == userProfile.Uid);
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

            return Ok(px);
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


        // POST: api/Pixel
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Pixel>> PostPixel(PixelBase newPixel)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            UserRecord userProfile = (UserRecord) HttpContext.Items["UserProfile"]!;
            Pixel px = BaseToPixel(newPixel, userProfile.Uid);
            
            await _convertaService.AddItem<Pixel>(px);
            
            return CreatedAtAction(nameof(PostPixel), new { id = newPixel.Id }, newPixel);
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

        private static Pixel BaseToPixel(PixelBase px, string uId)
        {
            return new() {
                Id = px.Id,
                Name = px.Name,
                Description = px.Description,
                AccessToken = px.AccessToken,
                PixelType = px.PixelType,
                UserId = uId
            };
        }
        private async Task<bool> PixelExists(string id)
        {
            return await _convertaService.ItemExists<Pixel>(px => px.Id == id);
        }
    }
}
