using System;
using System.Collections.Generic;

namespace WebCrawler.Models
{
    public partial class Lovedrecipe
    {
        public Guid CustomerId { get; set; }
        public int RecipeId { get; set; }
        public DateTime CreatedOn { get; set; }

        public virtual Customer Customer { get; set; } = null!;
        public virtual Recipe Recipe { get; set; } = null!;
    }
}
