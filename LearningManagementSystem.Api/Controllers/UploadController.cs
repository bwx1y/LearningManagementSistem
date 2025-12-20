using LearningManagementSystem.Api.Extention;
using LearningManagementSystem.Application.DTO.Upload;
using LearningManagementSystem.Application.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Minio;
using Minio.DataModel.Args;

namespace LearningManagementSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController(IUploadService uploadService, IUserService userService) : ControllerBase
    {
        [HttpGet("Request"), Authorize]
        public async Task<IActionResult> Get([FromQuery]UploadRequest req)
        {
            try
            {
                var user = await userService.FindById(User.GetUserId());
                if (user == null)
                    return Unauthorized();
                
                string fileName = $"{Guid.NewGuid()}_{req.FileName}";
                int exp = 120;

                var (uploadUrl, resultUrl, fields) = await uploadService.RequestUpload(user, fileName, exp);

                return Ok(new { uploadUrl, resultUrl, fields });
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }
        
    }
}
