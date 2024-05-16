using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace whatseat_server.Models;
public class OrderStatus
{
    [Key, Column(Order = 0)]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int OrderStatusId { get; set; }
    public string Value { get; set; }
}