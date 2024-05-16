using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace whatseat_server.Models.DTOs.Requests;

public class UserRegistrationDto
{
    [Required]
    public string UserName { get; set; }
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    [PasswordPropertyText]
    [Required]
    public string Password { get; set; }
}