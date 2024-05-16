namespace whatseat_server.Models.DTOs.Requests;
public class PagedStoreReviewRequest : PagedRequest
{
    public int StoreId { get; set; }
}