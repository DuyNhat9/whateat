namespace whatseat_server.Models.DTOs.Responses
{
    public class OrderStatusCountResponse
    {
        public int OrderStatusId { get; set; }
        public string OrderStatusName { get; set; } 
        public int Count { get; set; }
    }
}
