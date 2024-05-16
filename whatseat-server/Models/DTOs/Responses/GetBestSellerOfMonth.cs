namespace whatseat_server.Models.DTOs.Responses
{
    public class GetBestSellerOfMonth
    {
        public int ProductId { get; set; }
        public int Amount { get; set; }
        public string ProductName { get; set; }
    }
}
