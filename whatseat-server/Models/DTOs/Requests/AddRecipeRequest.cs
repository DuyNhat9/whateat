namespace whatseat_server.Models.DTOs.Requests
{
    public class AddRecipeRequest
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public int Serving { get; set; }
        public int TotalTime { get; set; }
        public string ThumbnailUrl { get; set; }
        public string videoUrl { get; set; }
        public List<int> RecipeTypeIds { get; set; }
        public string Ingredients { get; set; }
        public string Steps { get; set; }
        public string Level { get; set; }
    }
}