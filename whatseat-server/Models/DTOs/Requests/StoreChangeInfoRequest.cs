using System.ComponentModel.DataAnnotations;

namespace whatseat_server.Models.DTOs.Requests;

public class StoreChangeInfoRequest : StoreRegistrationRequest
{
    public int StoreId { get; set; }
}