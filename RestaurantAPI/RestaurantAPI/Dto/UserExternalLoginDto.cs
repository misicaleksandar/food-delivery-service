using System.ComponentModel.DataAnnotations;

namespace RestaurantAPI.Dto
{
    public class UserExternalLoginDto
    {
        [Required]
        public string Provider { get; set; }
        [Required]
        public string IdToken { get; set; }
    }
}
