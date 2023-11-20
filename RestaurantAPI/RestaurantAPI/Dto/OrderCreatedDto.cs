using RestaurantAPI.Models;

namespace RestaurantAPI.Dto
{
    public class OrderCreatedDto
    {
        public string Email { get; set; }
        public List<OrderItemDto> OrderItems { get; set; }
        public string Address { get; set; }
        public double Lat { get; set; }
        public double Lon { get; set; }
        public string PaymentMethod { get; set; }
    }
}
