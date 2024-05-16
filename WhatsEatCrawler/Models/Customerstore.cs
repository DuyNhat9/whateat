using System;
using System.Collections.Generic;

namespace WhatsEatCrawler.Models
{
    public partial class Customerstore
    {
        public Guid CustomerId { get; set; }
        public int StoreId { get; set; }
        public DateTime CreatedOn { get; set; }

        public virtual Customer Customer { get; set; } = null!;
        public virtual Store Store { get; set; } = null!;
    }
}
