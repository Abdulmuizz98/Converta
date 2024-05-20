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
    public class UserController : ControllerBase
    {
        private readonly ConvertaService _convertaService;

        public UserController(ConvertaService convertaService)
        {
            _convertaService = convertaService;
        }

        // GET: api/User
        // [HttpGet]
        // public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        // {
        //     return await _convertaService.GetItems<User>();
        // }

        // GET: api/User/5
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(string id)
        {
            var user = await _convertaService.GetItem<User>(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }


        // GET api/user/{userId}/pixels
        [HttpGet("{userId}/pixels")]
        public async Task<ActionResult<IEnumerable<Pixel>>> GetPixelsForUser(string userId)
        {
            if (await UserExists(userId) == false)
            {
                return NotFound("User not found");
            }

            return await _convertaService.GetItems<Pixel>(px => px.UserId == userId);
        }
  

        // POST: api/User
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User newUser)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // User user = BaseToUser(newUser);

            await _convertaService.AddItem<User>(newUser);

            return CreatedAtAction(nameof(GetUser), new { id = newUser.Id }, newUser);
        }

        // DELETE: api/User/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(Guid id)
        {
            var user = await _convertaService.GetItem<User>(id);

            if (user == null)
            {
                return NotFound();
            }

            await _convertaService.DeleteItem<User>(user);

            return NoContent();
        }

        private async Task<bool> UserExists(string id)
        {
            return await _convertaService.ItemExists<User>(u => u.Id == id);
        }
    }
}
