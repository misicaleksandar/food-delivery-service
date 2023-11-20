namespace RestaurantAPI.CustomExceptions
{
    public class InvalidExternalAuthenticationException : Exception
    {
        public InvalidExternalAuthenticationException(string? message) : base(message)
        {
        }
    }
}
