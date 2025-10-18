using System.Diagnostics;
using System.Reflection;

namespace LearningManagementSystem.Api.Extention;

public static class ServiceCollectionExtensions
{
    public static void AdaptApplicationServices(this IServiceCollection services)
    {
        var assembly = Assembly.GetExecutingAssembly();
        
        var types = assembly.GetTypes()
            .Where(t => t.IsClass && !t.IsAbstract)
            .Select(t => new
            {
                Implementation = t,
                Interface = t.GetInterfaces().FirstOrDefault(i => i.Namespace == "LearningManagementSystem.Application.Interface")
            })
            .Where(x => x.Interface != null);
        
        foreach (var type in types)
        {
            Debug.Assert(type.Interface != null, "type.Interface != null");
            services.AddScoped(type.Interface, type.Implementation);
        }
    }
}