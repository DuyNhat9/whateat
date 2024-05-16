namespace whatseat_server.Models.DTOs.Requests;

public class MenuRequest
{
    public string MenuName { get; set; }
    public List<int> RecipeIds { get; set; }
}