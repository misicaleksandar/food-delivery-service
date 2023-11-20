using System.ComponentModel.DataAnnotations;

namespace RestaurantAPI.Dto
{
    public class OrderAcceptanceDto
    {
        [Required]
        public long OrderId { get; set; }
        [Required]
        public string DelivererEmail { get; set; }
    }
}
