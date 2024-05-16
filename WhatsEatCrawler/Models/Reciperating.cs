using System;
using System.Collections.Generic;

namespace WhatsEatCrawler.Models
{
    public partial class Reciperating
    {
        public int RecipeRatingId { get; set; }
        public int Rating { get; set; }
        public DateTime CreatedOn { get; set; }
        public Guid? CustomerId { get; set; }
        public int? RecipeId { get; set; }

        public virtual Customer? Customer { get; set; }
        public virtual Recipe? Recipe { get; set; }
    }
}
