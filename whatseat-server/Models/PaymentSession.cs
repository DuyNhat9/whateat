using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace whatseat_server.Models;

public class PaymentSession
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int PaymentSessionId { get; set; }
    public string SessionId { get; set; }
    public int OrderId { get; set; }
    public Order Order { get; set; }
}