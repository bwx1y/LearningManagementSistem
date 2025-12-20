using System.Globalization;
using System.Text.Json;
using LearningManagementSystem.Application.DTO.Session;
using LearningManagementSystem.Application.Interface;

namespace LearningManagementSystem.Application.Service;

public class SessionService : ISessionService
{
    private readonly string _basePath = Path.Combine(AppContext.BaseDirectory, "Sessions");

    public List<CountryResponse> GetAllCountry()
    {
        return CultureInfo
            .GetCultures(CultureTypes.SpecificCultures)
            .Select(c => new RegionInfo(c.Name))
            .GroupBy(r => r.TwoLetterISORegionName)
            .Select(g => new CountryResponse
            {
                Code = g.Key,
                Name = g.First().EnglishName
            })
            .OrderBy(c => c.Name)
            .ToList();
    }

    public void SaveSession(CountryResponse request)
    {
        if (!Directory.Exists(_basePath))
            Directory.CreateDirectory(_basePath);

        var filePath = Path.Combine(_basePath, "country-session.json");

        var json = JsonSerializer.Serialize(request, new JsonSerializerOptions
        {
            WriteIndented = true
        });

        File.WriteAllText(filePath, json);
    }

    public async Task<CountryResponse> GetCountry()
    {
        var filePath = Path.Combine(_basePath, "country-session.json");

        if (!File.Exists(filePath))
            return new CountryResponse
            {
                Code = "UTC",
                Name = "United Kingdom"
            };

        var json = await File.ReadAllTextAsync(filePath);

        return JsonSerializer.Deserialize<CountryResponse>(json) ?? new CountryResponse
        {
            Code = "UTC",
            Name = "United Kingdom"
        };
    }
}