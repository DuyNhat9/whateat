using System;
using System.Collections.Generic;

namespace WebCrawler.Models
{
    public partial class Cartdetail
    {
        public int ProductId { get; set; }
        public Guid CustomerId { get; set; }
        public int Quantity { get; set; }
        public DateTime CreatedOn { get; set; }

        public virtual Customer Customer { get; set; } = null!;
        public virtual Product Product { get; set; } = null!;
    }
}
