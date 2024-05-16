namespace whatseat_server.Models.DTOs.Responses;

public class CartDetailResponse
{
    public int ProductId { get; set; }
    public int Quantity { get; set; }
    public DateTime CreatedOn { get; set; }
    public Store Store { get; internal set; }
    public string ProductName { get; internal set; }
    public List<List<Photo>> Images { get; set; }

}