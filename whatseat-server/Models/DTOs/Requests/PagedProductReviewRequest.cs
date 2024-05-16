namespace whatseat_server.Models.DTOs.Requests;

public class PagedProductReviewRequest : PagedRequest
{
    public int ProductId { get; set; }
}