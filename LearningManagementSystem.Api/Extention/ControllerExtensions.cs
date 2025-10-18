using Microsoft.AspNetCore.Mvc;

namespace LearningManagementSystem.Api.Extention;

public static class ControllerExtensions
{
    public static IActionResult ValidationError(
        this ControllerBase controller,
        string key,
        string message,
        int statusCode = StatusCodes.Status400BadRequest,
        string title = "Terjadi kesalahan",
        string detail = "")
    {
        var errors = new Dictionary<string, string[]>
        {
            { key, new[] { message } }
        };

        var problemDetails = new ValidationProblemDetails(errors)
        {
            Status = statusCode,
            Title = title,
            Detail = detail
        };

        return controller.ValidationProblem(problemDetails);
    }
}