using LearningManagementSystem.Application.Configuration;
using Minio;

namespace LearningManagementSystem.Api.Extention;

public static class ConMiniIoExtensions
{
    public static IServiceCollection AddMinioService(this IServiceCollection services, IConfiguration configuration)
    {
        var section = configuration.GetSection("Storage");
        services.Configure<MinIoConfiguration>(section);

        return services;
    }
}