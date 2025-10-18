using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

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
        // Buat ModelStateDictionary
        var modelState = new ModelStateDictionary();
        modelState.AddModelError(key, message);

        // Panggil overload ValidationProblem yang ada
        return controller.ValidationProblem(
            detail: detail,
            statusCode: statusCode,
            title: title,
            modelStateDictionary: modelState
        );
    }

}