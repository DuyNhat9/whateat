using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace whatseat_server.Models.DTOs.Requests;

public class TokenRequest
{
    [Required]
    public string Token { get; set; }
    [Required]
    public string RefreshToken { get; set; }
}