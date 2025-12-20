using System.Globalization;
using LearningManagementSystem.Application.DTO.Session;
using LearningManagementSystem.Application.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace LearningManagementSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SettingController(ISessionService service) : ControllerBase
    {
        [HttpGet("All-Country")]
        public IActionResult GetTime()
        {
            return Ok(service.GetAllCountry());
        }

        [HttpGet("Country")]
        public IActionResult GetCountry()
        {
            return Ok(service.GetCountry());
        }

        [HttpPost("Country")]
        public IActionResult SaveCountry([FromBody] CountryResponse req)
        {
            service.SaveSession(req);

            return Ok(req);
        } 
    }
}
