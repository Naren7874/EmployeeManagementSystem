using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly IRepository<Employee> employeeRepository;

        public EmployeeController(IRepository<Employee> employeeRepository)
        {
            this.employeeRepository = employeeRepository;
        }


        [HttpGet]
        public async Task<IActionResult> GetEmployeeList()
        {
            var list = await employeeRepository.GetAll();
            return Ok(list);
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetEmployee([FromRoute] int id)
        {
            return Ok(await employeeRepository.FindByIdAsync(id));
        }

        [HttpPost]
        public async Task<IActionResult> AddEmployee([FromBody] Employee model)
        {
            await employeeRepository.AddAsync(model);
            await employeeRepository.SaveChangeAsync();
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateEmployee([FromRoute] int id, [FromBody] Employee model)
        {
            var employee = await employeeRepository.FindByIdAsync(id);
            if( employee is null)
            {
                return NotFound();
            }
            employee.Name = model.Name;
            employee.Email = model.Email;
            employee.Phone = model.Phone;
            employee.DepartmentId = model.DepartmentId;
            employee.LastWorkingDate = model.LastWorkingDate;
            employee.JobTitle = model.JobTitle;
            employeeRepository.Update(employee);
            await employeeRepository.SaveChangeAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteEmployee([FromRoute]int id)
        {
            await employeeRepository.DeleteAsync(id);
            await employeeRepository.SaveChangeAsync();
            return Ok();
        }

    }
}
