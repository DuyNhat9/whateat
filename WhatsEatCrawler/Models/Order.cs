using System;
using System.Collections.Generic;

namespace WhatsEatCrawler.Models
{
    public partial class Order
    {
        public Order()
        {
            Orderdetails = new HashSet<Orderdetail>();
            Orderstatushistories = new HashSet<Orderstatushistory>();
            Paymentsessions = new HashSet<Paymentsession>();
        }

        public int OrderId { get; set; }
        public DateTime CreatedOn { get; set; }
        public bool IsPaid { get; set; }
        public int? ShipperId { get; set; }
        public int? PaymentMethodId { get; set; }
        public Guid? CustomerId { get; set; }
        public int? ShippingInfoId { get; set; }
        public int? StoreId { get; set; }
        public long ShippingFee { get; set; }

        public virtual Customer? Customer { get; set; }
        public virtual Paymentmethod? PaymentMethod { get; set; }
        public virtual Shipper? Shipper { get; set; }
        public virtual Shippinginfo? ShippingInfo { get; set; }
        public virtual Store? Store { get; set; }
        public virtual ICollection<Orderdetail> Orderdetails { get; set; }
        public virtual ICollection<Orderstatushistory> Orderstatushistories { get; set; }
        public virtual ICollection<Paymentsession> Paymentsessions { get; set; }
    }
}
