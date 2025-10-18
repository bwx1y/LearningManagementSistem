using System.Diagnostics;
using System.Reflection;
using Microsoft.Extensions.DependencyInjection;

namespace LearningManagementSystem.Api.Extention
{
    public static class ServiceCollectionExtensions
    {
        public static void AdaptApplicationServices(this IServiceCollection services)
        {
            // Cari semua assembly yang punya namespace "LearningManagementSystem"
            var assemblies = AppDomain.CurrentDomain.GetAssemblies()
                .Where(a => a.FullName != null &&
                            a.FullName.StartsWith("LearningManagementSystem"))
                .ToList();

            // Kalau belum dimuat (misalnya Application belum kena load otomatis)
            // coba load manual dari lokasi bin folder
            if (!assemblies.Any(a => a.GetName().Name == "LearningManagementSystem.Application"))
            {
                try
                {
                    var appAssembly = Assembly.Load("LearningManagementSystem.Application");
                    assemblies.Add(appAssembly);
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"Gagal memuat assembly Application: {ex.Message}");
                }
            }

            // Daftarkan semua class yang punya interface di namespace Interface
            foreach (var assembly in assemblies)
            {
                var types = assembly.GetTypes()
                    .Where(t => t.IsClass && !t.IsAbstract)
                    .Select(t => new
                    {
                        Implementation = t,
                        Interface = t.GetInterfaces().FirstOrDefault(i =>
                            i.Namespace != null &&
                            i.Namespace.Contains("LearningManagementSystem.Application.Interface"))
                    })
                    .Where(x => x.Interface != null);

                foreach (var type in types)
                {
                    services.AddScoped(type.Interface!, type.Implementation);
                }
            }
        }
    }
}
