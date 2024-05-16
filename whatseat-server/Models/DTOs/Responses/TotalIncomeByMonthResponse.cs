namespace whatseat_server.Models.DTOs.Responses
{
    public class TotalIncomeByMonthResponse
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public int Day { get; set; }
        public int Total { get; set; }
    }
}
