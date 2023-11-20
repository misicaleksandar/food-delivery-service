namespace RestaurantAPI.Models
{
    public class Order
    {
        public long Id { get; set; }
        public string? Address { get; set; }
        public double Lat { get; set; }
        public double Lon { get; set; }
        public double TotalPrice { get; set; }
        public string? PaymentMethod { get; set; }
        public bool PaymentCompleted { get; set; }
        public string? Comment { get; set; }
        public DateTime? AcceptedTime { get; set; }
        public bool Completed { get; set; }
        public List<OrderItem>? OrderItems { get; set; }


        public long CustomerId { get; set; }
        public Customer? Customer { get; set; }

        public long? DelivererId { get; set; }
        public Deliverer? Deliverer { get; set; }

    }
}
