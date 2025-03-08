using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Data;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly AppDbContext _context;
        public EmployeeController(AppDbContext dbContext)
        {
            _context = dbContext;
        }


        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_context.Employees.ToList());
        }
    }
}
