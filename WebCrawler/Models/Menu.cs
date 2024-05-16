using System;
using System.Collections.Generic;

namespace WebCrawler.Models
{
    public partial class Menu
    {
        public Menu()
        {
            Recipes = new HashSet<Recipe>();
        }

        public int MenuId { get; set; }
        public string? MenuName { get; set; }
        public DateTime ModifiedOn { get; set; }
        public Guid? CustomerId { get; set; }

        public virtual Customer? Customer { get; set; }

        public virtual ICollection<Recipe> Recipes { get; set; }
    }
}
