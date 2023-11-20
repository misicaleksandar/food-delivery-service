using System.ComponentModel.DataAnnotations;

namespace RestaurantAPI.Dto
{
    public class UserPasswordChangeDto
    {
        [Required]
        public string Email { get; set; }
        [Required]
        [MinLength(4)]
        public string Password { get; set; }
    }
}
