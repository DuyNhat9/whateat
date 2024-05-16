namespace whatseat_server.Models.DTOs.Responses
{
    public class UpdateCaloResponse
    {
        public float Calo { get; set; }
        public string Allergy { get; set; }

        public UpdateCaloResponse(float calo, string allergy)
        {
            Calo = calo;
            Allergy = allergy;
        }
    }
}
