using LearningManagementSystem.Api.Extention;
using LearningManagementSystem.Application.DTO.Quiz;
using LearningManagementSystem.Application.Interface;
using LearningManagementSystem.Domain.Entity;
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
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> CreateQuiz(QuizRequest req)
        {
            var entity = await quizService.Create(req);
            
            return Created("", entity.Adapt<QuizTeacherResponse>());
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> UpdateQuiz(Guid id, QuizUpdateRequest req)
        {
            var entity = await quizService.GetOne(id);
            if (entity == null)
                return this.ValidationError(
                    title: "Not found",
                    message: "Not found",
                    key: "Quiz",
                    statusCode: StatusCodes.Status404NotFound
                );
            
            entity.EndTime = req.EndTime;
            entity.StartTime = req.StartTime;
            entity.Title =  req.Title;

            foreach (var item in req.Question)
            {
                if (item.Id != null || item.Id != Guid.Empty)
                {
                    var find = entity.Question.FirstOrDefault(x => x.Id == item.Id);
                    if (find == null) continue;
                    
                    find.Text = item.Text;

                    foreach (var choiceRequest in item.Choice.Slice(0, 4))
                    {
                        var choice = find.Choice.FirstOrDefault(f => f.Id == choiceRequest.Id);
                        if (choice == null) continue;
                        
                        choice.Text = choiceRequest.Text;
                        choice.IsCorrect = choiceRequest.IsCorrect;
                    }
                }
                else
                {
                    entity.Question.Add(new QuizQuestion
                    {
                        Text = item.Text,
                        Choice = item.Choice.Select(f => new Choice
                        {
                            Text = f.Text,
                            IsCorrect = f.IsCorrect
                        }).ToList()
                    });
                }
            }

            await quizService.Update(entity);
            return Ok(entity.Adapt<QuizTeacherResponse>());
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> DeleteQuiz(Guid id)
        {
            var entity = await quizService.GetOne(id);
            if (entity == null)
                return this.ValidationError(
                    title: "Not found",
                    message: "Not found",
                    key: "Quiz",
                    statusCode: StatusCodes.Status404NotFound
                );

            await quizService.Delete(entity);

            return Ok(new { Message = "Success delete" });
        }
    }
}
