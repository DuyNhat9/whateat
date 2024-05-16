using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace whatseat_server.Models;
public class ProductViewHistory
{
    [Key, Column(Order = 0)]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int ProductViewHistoryId { get; set; }
    public DateTime CreatedOn { get; set; }
    public Customer Customer { get; set; }
    public Product Product { get; set; }
}