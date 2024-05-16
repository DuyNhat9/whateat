using System;
using System.Collections.Generic;

namespace WhatsEatCrawler.Models
{
    public partial class Recipestep
    {
        public Recipestep()
        {
            Recipestepimages = new HashSet<Recipestepimage>();
        }

        public int RecipeStepId { get; set; }
        public int Step { get; set; }
        public string? Content { get; set; }

        public virtual ICollection<Recipestepimage> Recipestepimages { get; set; }
    }
}
