using Newtonsoft.Json;

namespace whatseat_server.Models;

public class LovedProduct
{
    public Guid CustomerId { get; set; }
    [JsonIgnore]
    public Customer Customer { get; set; }
    public int ProductId { get; set; }
    [JsonIgnore]
    public Product Product { get; set; }
    public DateTime CreatedOn { get; set; }
}