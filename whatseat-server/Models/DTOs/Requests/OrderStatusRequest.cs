using System.ComponentModel.DataAnnotations;

namespace whatseat_server.Models.DTOs.Requests;
public class OrderStatusRequest
{
    [Required]
    public int OrderId { get; set; }
    [Required]
    public string Message { get; set; }
}