namespace whatseat_server.Models.DTOs.Requests;
public class SearchParams : PagedRequest
{
    public string searchTerm { get; set; }

}