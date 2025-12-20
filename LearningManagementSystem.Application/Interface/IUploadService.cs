using LearningManagementSystem.Domain.Entity;

namespace LearningManagementSystem.Application.Interface;

public interface IUploadService
{
    Task<(string uploadUrl, string resultUrl, IDictionary<string, string> fields)> RequestUpload(User user, string objectName, int exp);
}