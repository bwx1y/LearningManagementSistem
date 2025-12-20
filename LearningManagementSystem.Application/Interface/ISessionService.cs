using LearningManagementSystem.Application.DTO.Session;

namespace LearningManagementSystem.Application.Interface;

public interface ISessionService
{
    public List<CountryResponse> GetAllCountry();

    public void SaveSession(CountryResponse request);

    public Task<CountryResponse> GetCountry();
}