using System;
using System.Collections.Generic;

namespace WhatsEatCrawler.Models
{
    public partial class Shippinginfo
    {
        public Shippinginfo()
        {
            Orders = new HashSet<Order>();
        }

        public int ShippingInfoId { get; set; }
        public string? PhoneNumber { get; set; }
        public int ProvinceCode { get; set; }
        public int DistrictCode { get; set; }
        public int WardCode { get; set; }
        public string? Address { get; set; }
        public Guid? CustomerId { get; set; }
        public bool Status { get; set; }
        public string? Name { get; set; }

        public virtual Customer? Customer { get; set; }
        public virtual ICollection<Order> Orders { get; set; }
    }
}
