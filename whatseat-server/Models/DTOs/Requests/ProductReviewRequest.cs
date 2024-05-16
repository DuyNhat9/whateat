namespace whatseat_server.Models.DTOs.Requests;

public class ProductReviewRequest
{
    public int ProductId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; }
}