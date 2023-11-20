namespace RestaurantAPI.Dto
{
    public class UserDto
    {
        public long Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; }
        public string Type { get; set; }
        public string Image { get; set; }
        public List<OrderDto> Orders { get; set; }
        public bool Verified { get; set; }
    }
}
