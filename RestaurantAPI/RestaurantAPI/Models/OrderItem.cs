namespace RestaurantAPI.Models
{
    public class OrderItem
    {
        public long Id { get; set; }
        public long OrderId { get; set; }
        public Order? Order { get; set; }

        public long ProductId { get; set; }
        public Product? Product { get; set; }

        public int Amount { get; set; }

    }
}
