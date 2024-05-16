namespace whatseat_server.Models.DTOs.Requests;

public class StoreReviewRequest
{
    public int StoreId { get; set; }
    public int Rating { get; set; }
    public string Comment { get; set; }
}