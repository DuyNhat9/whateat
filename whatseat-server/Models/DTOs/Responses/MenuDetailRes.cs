namespace whatseat_server.Models.DTOs.Responses;

public class MenuDetailRes
{
    public int MenuId { get; set; }
    public string MenuName { get; set; }
    public DateTime ModifiedOn { get; set; }
    public string UserName { get; set; }
    public int UserId { get; set; }
    public List<MenuRecipeResponse> Recipes { get; set; }
}