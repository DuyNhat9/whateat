using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace whatseat_server.Models;
public class OrderDetail
{
    [Key]
    public int OrderId { get; set; }
    [JsonIgnore]
    public Order Order { get; set; }
    [Key]
    public int ProductId { get; set; }
    [JsonIgnore]
    public Product Product { get; set; }
    public int Quantity { get; set; }
    public int Price { get; set; }
}