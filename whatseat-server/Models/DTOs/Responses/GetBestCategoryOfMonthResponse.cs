namespace whatseat_server.Models.DTOs.Responses
{
    public class GetBestCategoryOfMonthResponse
    {
        public int ProductCategoryId { get; set; }
        public int Amount { get; set; }
        public string ProductCategoryName { get; set; }
    }
}
