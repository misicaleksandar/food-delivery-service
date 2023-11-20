namespace RestaurantAPI.Models
{
    public class Customer : User
    {
        public List<Order>? Orders { get; set; }
    }
}
