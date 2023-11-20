namespace RestaurantAPI.Models
{
    public class Product
    {
        public long Id { get; set; }
        public string? Name { get; set; }
        public string? Ingredients { get; set; }
        public double Price { get; set; }

        public List<OrderItem>? OrderItems { get; set; }
    }
}
