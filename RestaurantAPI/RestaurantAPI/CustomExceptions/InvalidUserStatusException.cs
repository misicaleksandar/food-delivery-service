namespace RestaurantAPI.CustomExceptions
{
    public class InvalidUserStatusException : Exception
    {
        public InvalidUserStatusException(string? message) : base(message)
        {
        }
    }
}
