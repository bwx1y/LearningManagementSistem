using System.Security.Claims;
using LearningManagementSystem.Domain.Enum;

namespace LearningManagementSystem.Api.Extention;

public static class ClaimsPrincipalExtensions
{
    public static Guid GetUserId(this ClaimsPrincipal principal)
    {
        var userId = principal.FindFirst(ClaimTypes.Sid)?.Value;
        if (userId == null) return Guid.Empty;
        return Guid.Parse(userId);
    }

    public static Role GetRole(this ClaimsPrincipal principal)
    {
        var roleValue = principal.FindFirst(ClaimTypes.Role)?.Value;
        if (roleValue == null)
        {
            throw new InvalidOperationException("Role not found.");
        }
        
        if (Enum.TryParse<Role>(roleValue, true, out var role))
        {
            return role;
        }
        
        throw new InvalidOperationException($"Role claim '{roleValue}' invalid.");
    }
}