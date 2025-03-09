using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using server.Data;
using server.Models;

namespace server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly IRepository<Department> departmentRepository;
        public DepartmentController(IRepository<Department> departmentRepository) {
            this.departmentRepository = departmentRepository;
        }

        [HttpPost]
        public async Task<IActionResult> AddDepartment([FromBody] Department department)
        {
            await departmentRepository.AddAsync(department);
            await departmentRepository.SaveChangeAsync();
            return Ok(department);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDepartment([FromRoute] int id, [FromBody] Department model)
        {   
            var deparment = await departmentRepository.FindByIdAsync(id);
            if (deparment == null) {
                return NotFound();
            }
            deparment.Name = model.Name;
            departmentRepository.Update(deparment);
            await departmentRepository.SaveChangeAsync();
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> GetAllDepartment()
        {
            var list = await departmentRepository.GetAll();
            return Ok(list);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment([FromRoute] int id)
        {
            await departmentRepository.DeleteAsync(id);
            await departmentRepository.SaveChangeAsync();
            return Ok();
        }
    }
}
