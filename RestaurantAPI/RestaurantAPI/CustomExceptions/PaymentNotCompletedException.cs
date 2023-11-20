namespace RestaurantAPI.CustomExceptions
{
    public class PaymentNotCompletedException : Exception
    {
        public PaymentNotCompletedException(string? message) : base(message)
        {
        }
    }
}
