using System;
using System.Collections.Generic;

namespace WebCrawler.Models
{
    public partial class Paymentmethod
    {
        public Paymentmethod()
        {
            Orders = new HashSet<Order>();
        }

        public int PaymentMethodId { get; set; }
        public string? Value { get; set; }

        public virtual ICollection<Order> Orders { get; set; }
    }
}
