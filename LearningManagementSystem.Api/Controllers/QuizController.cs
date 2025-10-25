using LearningManagementSystem.Api.Extention;
using LearningManagementSystem.Application.DTO.Quiz;
using LearningManagementSystem.Application.Interface;
using LearningManagementSystem.Domain.Enum;
using Mapster;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LearningManagementSystem.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizController(IQuizService quizService) : ControllerBase
    {
        [HttpGet("{id}")]
        [Authorize(Roles = "Teacher,Student")]
        public async Task<IActionResult> GetQuiz(Guid id)
        {
            var role = User.GetRole();
            
            var entity = await quizService.GetOne(id);
            if (entity == null)
                return this.ValidationError(
                    title: "Not found",
                    message: "Not found",
                    key: "Quiz",
                    statusCode: StatusCodes.Status404NotFound
                ); 
            
            if (role == Role.Student) return Ok(entity.Adapt<QuizUserResponse>());

            return Ok(entity.Adapt<QuizTeacherResponse>());
        }

        [HttpPost]
        [Authorize(Roles = "Teacher,Student")]
        public async Task<IActionResult> CreateQuiz()
        {
            return Created("", new {});
        }
    }
}
