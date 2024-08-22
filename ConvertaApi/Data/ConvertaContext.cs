using Microsoft.EntityFrameworkCore;
using ConvertaApi.Models;

namespace ConvertaApi.Data
{
    public class ConvertaContext(DbContextOptions<ConvertaContext> options) : DbContext(options)
    {
        public DbSet<Pixel> Pixel { get; set; } = default!;
        public DbSet<Lead> Lead { get; set; } = default!;
        public DbSet<MetaEvent> MetaEvent { get; set; } = default!;
        public DbSet<CustomData> CustomData { get; set; } = default!;
        public DbSet<UserData> UserData { get; set; } = default!;


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Pixel to Lead relationship (one-to-many)
            modelBuilder.Entity<Pixel>()
                .HasMany<Lead>()
                .WithOne()
                .HasForeignKey(e => e.PixelId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();

            // Pixel to MetaEvent relationship (one-to-many)
            modelBuilder.Entity<Pixel>()
                .HasMany<MetaEvent>()
                .WithOne()
                .HasForeignKey(e => e.PixelId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();            

            // Lead to MetaEvent relationship (one-to-many)
            modelBuilder.Entity<Lead>()
                .HasMany<MetaEvent>()
                .WithOne()
                .HasForeignKey(e => e.LeadId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();  

            // MetaEvent to Custom Data relationship (one-to-one)
            modelBuilder.Entity<CustomData>()
                .HasKey(e => e.MetaEventId);
            
            modelBuilder.Entity<MetaEvent>()
                .HasOne(e => e.CustomData)
                .WithOne()
                .HasForeignKey<CustomData>(e => e.MetaEventId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired(false);

            // MetaEvent to Custom Data relationship (one-to-one)
            modelBuilder.Entity<UserData>()
                .HasKey(e => e.MetaEventId);
            
            modelBuilder.Entity<MetaEvent>()
                .HasOne(e => e.UserData)
                .WithOne()
                .HasForeignKey<UserData>(e => e.MetaEventId)
                .OnDelete(DeleteBehavior.Cascade)
                .IsRequired();
        }
    }
}
