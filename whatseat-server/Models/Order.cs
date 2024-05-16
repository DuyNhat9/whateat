using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
namespace whatseat_server.Models;
public class Order
{
    [Key, Column(Order = 0)]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int OrderId { get; set; }
    public DateTime CreatedOn { get; set; }
    public bool IsPaid { get; set; } = false;
    public Shipper Shipper { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public ICollection<OrderDetail> OrderDetails { get; set; }
    public Customer Customer { get; set; }
    public ShippingInfo ShippingInfo { get; set; }
    [JsonIgnore]
    public Store Store { get; set; }
    public virtual ICollection<OrderStatusHistory> OrderStatusHistories { get; set; }
    public long ShippingFee { get; set; }
}