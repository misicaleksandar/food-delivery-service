namespace RestaurantAPI.Models
{
    public class Deliverer : User
    {
        public List<Order>? Orders { get; set; }
        public bool Verified { get; set; }
    }
}
