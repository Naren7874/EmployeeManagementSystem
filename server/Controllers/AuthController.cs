using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using server.Data;
using server.DTOs;
using server.Models;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IRepository<User> userRepository;
        private readonly IConfiguration  configuration;

        public AuthController(IRepository<User> userRepository, IConfiguration configuration)
        {
            this.userRepository = userRepository;
            this.configuration = configuration;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthDto model)
        {
            var user = (await userRepository.GetAll(x => x.Email == model.Email)).FirstOrDefault();
           
            if (user == null) {
                return new BadRequestObjectResult(new { message = "user not found" });
            }
            if(user.Password != model.Password)
            {
                return new BadRequestObjectResult(new { message = "invelid cradentials" });
            }
            var token = GenerateToken(user.Email, user.Role);
            return Ok(new AuthTokenDto()
            {
                Id = user.Id,
                Email= user.Email,
                Token = token
            });
        }

        private string GenerateToken(string email ,string role)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JwtKey"]!));
            var credentials = new SigningCredentials(key,SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(ClaimTypes.Name, email),
                new Claim(ClaimTypes.Role , role)
            };
           var token = new JwtSecurityToken(
                claims:claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials:credentials
                );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}