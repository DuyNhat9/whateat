using System;
using System.Collections.Generic;

namespace WebCrawler.Models
{
    public partial class Lovedproduct
    {
        public Guid CustomerId { get; set; }
        public int ProductId { get; set; }
        public DateTime CreatedOn { get; set; }

        public virtual Customer Customer { get; set; } = null!;
        public virtual Product Product { get; set; } = null!;
    }
}
