namespace whatseat_server.Models.DTOs.Responses
{
    public class SimpleProductResponse
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
        public int BasePrice { get; set; }
        public List<List<Photo>> Images { get; set; }
        public string WeightServing { get; set; }
        public int TotalSell { get; set; }
    }
}
