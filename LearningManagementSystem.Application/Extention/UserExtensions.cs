using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LearningManagementSystem.Domain.Entity;
using Microsoft.IdentityModel.Tokens;

namespace LearningManagementSystem.Api.Configuration;

public static class UserExtensions
{
    public static string GenerateToken(this User user, string secret, int hoursToExpire)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(secret);
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Sid, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role.ToString()),
            }),
            Expires = DateTime.UtcNow.AddHours(hoursToExpire),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}