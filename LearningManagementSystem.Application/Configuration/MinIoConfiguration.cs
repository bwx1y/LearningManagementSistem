namespace LearningManagementSystem.Application.Configuration;

public class MinIoConfiguration
{
    public string Endpoint { get; set; } = string.Empty;
    public string AccessKey { get; set; } = string.Empty;
    public string SecretKey { get; set; } = string.Empty;
    public bool WithSsl { get; set; } = false;
}