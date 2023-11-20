using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RestaurantAPI.Models;

namespace RestaurantAPI.Infrastructure.Configurations
{
    public class DelivererConfiguration : IEntityTypeConfiguration<Deliverer>
    {
        public void Configure(EntityTypeBuilder<Deliverer> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();
            
            builder.HasIndex(x => x.Email).IsUnique();
        }
    }
}
