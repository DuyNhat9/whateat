using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace whatseat_server.Models;

public class CartDetail
{
    public int ProductId { get; set; }
    [ForeignKey(nameof(ProductId))]
    public Product Product { get; set; }
    public Guid CustomerId { get; set; }
    [ForeignKey(nameof(CustomerId))]
    public Customer Customer { set; get; }
    public int Quantity { get; set; }
    public DateTime CreatedOn { get; set; }

}