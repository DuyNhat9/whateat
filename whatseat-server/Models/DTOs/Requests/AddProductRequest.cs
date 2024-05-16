namespace whatseat_server.Models.DTOs.Requests;

public class AddProductRequest
{
    public string Name { get; set; }
    public int InStock { get; set; }
    public int BasePrice { get; set; }
    public string Description { get; set; }
    public int ProductCategoryId { get; set; }
    public int StoreId { get; set; }
    public string ImageUrl { get; set; }
}