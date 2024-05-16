using whatseat_server.Configuration;

namespace whatseat_server.Models.DTOs.Responses;

public class RegistrationResponseDto : AuthResult
{
    public string UserName { get; set; }
    public string UserId { get; set; }
}