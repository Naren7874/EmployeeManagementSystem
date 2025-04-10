using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using server.Data;
using server.DTOs;
using server.Models;
using server.Service;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IRepository<User> userRepository;
        private readonly IRepository<Employee> employeeRepository;
        private readonly IConfiguration  configuration;

        public AuthController(IRepository<User> userRepository,IRepository<Employee> employeeRepository, IConfiguration configuration)
        {
            this.userRepository = userRepository;
            this.employeeRepository = employeeRepository;
            this.configuration = configuration;
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] AuthDto model)
        {
            var user = (await userRepository.GetAll(x => x.Email == model.Email)).FirstOrDefault();
           
            if (user == null) {
                return new BadRequestObjectResult(new { message = "user not found" });
            }
            if(!PasswordHelper.VerifyPassword(user.Password,model.Password))
            {
                return new BadRequestObjectResult(new { message = "invelid cradentials" });
            }
            var token = GenerateToken(user.Email, user.Role);
            return Ok(new AuthTokenDto()
            {
                Id = user.Id,
                Email= user.Email,
                Token = token,
                Role = user.Role
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

        //profile update
        [Authorize]
        [HttpPut("profile-update")]
        public async Task<IActionResult> UpdateProfile([FromBody] ProfileDto profileDto)
        {
            var currEmail = User.FindFirstValue(ClaimTypes.Name);
            if (currEmail == null)
            {
                return new BadRequestObjectResult(new { message = "user not found" });
            }
            var user = (await userRepository.GetAll(x => x.Email == currEmail)).First();
            if (user == null)
            {
                return new BadRequestObjectResult(new { message = "user not found" });
            }
            if (profileDto.Password != null)
            {
                user.Password = PasswordHelper.HashPassword(profileDto.Password);
            }
            user.Email = profileDto.Email;
            user.Avatar = profileDto.Avatar;

            userRepository.Update(user);
            await userRepository.SaveChangeAsync();
            var employee = (await employeeRepository.GetAll(x => x.UserId == user.Id)).First();
            if (employee != null)
            {
                employee.Name = profileDto.Name;
                employee.Phone = profileDto.Phone;
                employeeRepository.Update(employee);
                await employeeRepository.SaveChangeAsync();
            }
            return Ok(new { message = "profile updated successfully" });
        }

    }
}