namespace whatseat_server.Models.DTOs.Responses;

public class StoreReviewResponse
{
    public int StoreReviewId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; }
    public DateTime CreatedOn { get; set; }
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; }
}