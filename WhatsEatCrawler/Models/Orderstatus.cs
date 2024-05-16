using System;
using System.Collections.Generic;

namespace WhatsEatCrawler.Models
{
    public partial class Orderstatus
    {
        public Orderstatus()
        {
            Orderstatushistories = new HashSet<Orderstatushistory>();
        }

        public int OrderStatusId { get; set; }
        public string? Value { get; set; }

        public virtual ICollection<Orderstatushistory> Orderstatushistories { get; set; }
    }
}
