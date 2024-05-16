using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace whatseat_server.Models
{
    public class KcalReference
    {
        [Key, Column(Order = 0)]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int KcalId { get; set; }
        public int MinYearsOld { get; set; }
        public int MaxYearsOld { get; set; }
        public string Gender { get; set; }
        public string PAL { get; set; }
        public float Kcal { get; set; }

    }
}
