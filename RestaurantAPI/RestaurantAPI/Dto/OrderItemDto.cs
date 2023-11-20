namespace RestaurantAPI.Dto
{
    public class OrderItemDto
    {
        public string Name { get; set; }
        public string Ingredients { get; set; }
        public double Price { get; set; }
        public int Amount { get; set; }
    }
}
