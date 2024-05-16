namespace whatseat_server.Models.DTOs.Requests
{
    public class AddCaloRequest
    {
        public string Year { get; set; }
        public string Gender { get; set; }
        public string PAL { get; set; }
        public int Weight { get; set; }
        public int Height { get; set; }
        public string Allergy { get; set; }
        public int Person {get;set;}
    }
}
