namespace RestaurantAPI.CustomExceptions
{
    public class InvalidUserDataException : Exception
    {
        public InvalidUserDataException(string? message) : base(message)
        {
        }
    }
}
