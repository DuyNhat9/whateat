using System;
using System.Collections.Generic;

namespace WebCrawler.Models
{
    public partial class Refreshtoken
    {
        public Guid Id { get; set; }
        public int Status { get; set; }
        public DateTime AddedDate { get; set; }
        public DateTime UpdateDate { get; set; }
        public string? UserId { get; set; }
        public string? Token { get; set; }
        public string? JwtId { get; set; }
        public bool IsUsed { get; set; }
        public bool IsRevoked { get; set; }
        public DateTime ExpiryDate { get; set; }

        public virtual Aspnetuser? User { get; set; }
    }
}
