namespace whatseat_server.Models;
public class CustomerStore
{
    public Guid CustomerId { get; set; }
    public Customer Customer { get; set; }
    public int StoreId { get; set; }
    public Store Store { get; set; }
    public DateTime CreatedOn { get; set; }

}