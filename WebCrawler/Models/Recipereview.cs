using System;
using System.Collections.Generic;

namespace WebCrawler.Models
{
    public partial class Recipereview
    {
        public int RecipeReviewId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
        public DateTime CreatedOn { get; set; }
        public int? RecipeId { get; set; }
        public Guid? CustomerId { get; set; }

        public virtual Customer? Customer { get; set; }
        public virtual Recipe? Recipe { get; set; }
    }
}
