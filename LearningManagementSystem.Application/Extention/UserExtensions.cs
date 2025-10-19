using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LearningManagementSystem.Application.Configuration;
using LearningManagementSystem.Domain.Entity;
using Microsoft.IdentityModel.Tokens;

namespace LearningManagementSystem.Application.Extention;

public static class UserExtensions
{
    public static string GenerateToken(this User user, JwtConfiguration configuration)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(configuration.Key);
        
        
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Issuer = configuration.Issuer,
            Audience = configuration.Audience,
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Sid, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
            }),
            Expires = DateTime.UtcNow.AddHours(Math.Ceiling((double) (configuration.DurationInMinutes / 60))),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}