namespace whatseat_server.Models.DTOs.Requests;

public class OrderRequest
{
    public List<CartDetailRequest> ProductList { get; set; }
}