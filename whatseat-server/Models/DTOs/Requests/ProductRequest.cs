namespace whatseat_server.Models.DTOs.Requests;

public class ProductRequest
{
    public string Name { get; set; }
    public int InStock { get; set; }
    public int BasePrice { get; set; }
    public string PhotoJson { get; set; }
    public string Description { get; set; }
    public string WeightServing { get; set; }
    public int ProductCategoryId { get; set; }
}
