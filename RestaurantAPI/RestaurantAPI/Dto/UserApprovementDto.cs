using System.ComponentModel.DataAnnotations;

namespace RestaurantAPI.Dto
{
    public class UserApprovementDto
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public bool Approve { get; set; }
    }
}
