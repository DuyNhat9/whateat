namespace whatseat_server.Models.DTOs.Responses;

public class MyStoresResponse
{
    public int StoreId { get; set; }
    public string ShopName { get; set; }
    public bool IsActive { get; set; }
    public string AvatarUrl { get; set; }
}