using System;
using System.Collections.Generic;

namespace WhatsEatCrawler.Models
{
    public partial class Unit
    {
        public Unit()
        {
            Ingredients = new HashSet<Ingredient>();
        }

        public int UnitId { get; set; }
        public string? Value { get; set; }

        public virtual ICollection<Ingredient> Ingredients { get; set; }
    }
}
