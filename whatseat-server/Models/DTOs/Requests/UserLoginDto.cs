using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace whatseat_server.Models.DTOs.Requests;

public class UserLoginDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    [Required]
    public string Password { get; set; }
}