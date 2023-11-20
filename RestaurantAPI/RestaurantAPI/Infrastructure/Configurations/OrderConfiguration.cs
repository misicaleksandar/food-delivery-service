using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using RestaurantAPI.Models;

namespace RestaurantAPI.Infrastructure.Configurations
{
    public class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder.HasKey(x => x.Id);
            builder.Property(x => x.Id).ValueGeneratedOnAdd();

            builder.Property(x => x.Comment).HasMaxLength(300);

            builder.HasOne(x => x.Customer)
                   .WithMany(x => x.Orders)
                   .HasForeignKey(x => x.CustomerId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(x => x.Deliverer)
                   .WithMany(x => x.Orders)
                   .HasForeignKey(x => x.DelivererId)
                   .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
