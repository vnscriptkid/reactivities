using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Activity> Activities { get; set; }
        public DbSet<ActivityAttendee> ActivityAttendees { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<UserFollowing> UserFollowings { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Determine primary key of join table
            builder.Entity<ActivityAttendee>()
                .HasKey(aa => new { aa.AppUserId, aa.ActivityId });

            // Determine relationship between `AppUsers` table and join table
            builder.Entity<ActivityAttendee>()
                .HasOne(aa => aa.AppUser)
                .WithMany(u => u.Activities)
                .HasForeignKey(aa => aa.AppUserId);

            // Determine relationship between `Activities` table and join table
            builder.Entity<ActivityAttendee>()
                .HasOne(aa => aa.Activity)
                .WithMany(a => a.Attendees)
                .HasForeignKey(aa => aa.ActivityId);

            builder.Entity<Comment>()
                .HasOne(c => c.Activity)
                .WithMany(c => c.Comments)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserFollowing>(b =>
            {
                b.HasKey(k => new { k.ObserverId, k.TargetId });

                b.HasOne(uf => uf.Observer)
                .WithMany(observer => observer.Followings)
                .HasForeignKey(uf => uf.ObserverId)
                .OnDelete(DeleteBehavior.Cascade);

                b.HasOne(uf => uf.Target)
                .WithMany(target => target.Followers)
                .HasForeignKey(uf => uf.TargetId)
                .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}