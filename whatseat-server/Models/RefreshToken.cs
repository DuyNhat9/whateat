using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Identity;

namespace whatseat_server.Models;
public class RefreshToken
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public int Status { get; set; } = 1;
    public DateTime AddedDate { get; set; } = DateTime.UtcNow;
    public DateTime UpdateDate { get; set; }
    public string UserId { get; set; }
    public string Token { get; set; }
    public string JwtId { get; set; }
    public bool IsUsed { get; set; }
    public bool IsRevoked { get; set; }
    public DateTime ExpiryDate { get; set; }

    [ForeignKey(nameof(UserId))]
    public IdentityUser User { get; set; }
}