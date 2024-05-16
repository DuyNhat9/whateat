namespace whatseat_server.Models.DTOs.Responses;

public class ProductResponse
{
    public int ProductId { get; set; }
    public string Name { get; set; }
    public int InStock { get; set; }
    public int BasePrice { get; set; }
    public string Description { get; set; }
    public string WeightServing { get; set; }
    public int TotalSell { get; set; }
    public int ProductCategoryId { get; set; }
    public DateTime CreatedOn { get; set; }
    public int TotalView { get; set; }
    public List<List<Photo>> Images { get; set; }
    public int StoreId { get; internal set; }
    public string StoreName { get; internal set; }
    public bool Status { get; internal set; }
}