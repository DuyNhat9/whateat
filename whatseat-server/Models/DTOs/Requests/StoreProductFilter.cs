namespace whatseat_server.Models.DTOs.Requests;

public class StoreProductFilter : PagedRequest
{
    public int StoreId { get; set; }

}