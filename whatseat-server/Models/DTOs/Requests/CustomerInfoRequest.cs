using System.ComponentModel.DataAnnotations;

namespace whatseat_server.Models.DTOs.Requests;

public class CustomerInfoRequest
{
    public string Name { get; set; }
    [EmailAddress]
    public string Email { get; set; }
    public string IdCard { get; set; }
    public string AvatarUrl { get; set; }
}