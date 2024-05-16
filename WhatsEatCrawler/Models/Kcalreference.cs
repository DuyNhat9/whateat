using System;
using System.Collections.Generic;

namespace WhatsEatCrawler.Models
{
    public partial class Kcalreference
    {
        public int KcalId { get; set; }
        public int MinYearsOld { get; set; }
        public int MaxYearsOld { get; set; }
        public string? Gender { get; set; }
        public string? Pal { get; set; }
        public float Kcal { get; set; }
    }
}
