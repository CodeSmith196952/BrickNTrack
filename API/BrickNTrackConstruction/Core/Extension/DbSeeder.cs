using BrickNTrack.Domain.CommonModel;
using BrickNTrack.Repository.Context;
using BrickNTrack.Repository.Entity;
using Microsoft.EntityFrameworkCore;
using BC = BCrypt.Net.BCrypt;

namespace BrickNTrackConstruction.Core.Extension
{
    public static class DbSeeder
    {
        public static async Task SeedAdminUserAsync(IServiceProvider serviceProvider)
        {
            try
            {
                using var scope = serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<BrickNTrackContext>();
                var config = scope.ServiceProvider.GetRequiredService<IConfiguration>();
                var logger = scope.ServiceProvider.GetRequiredService<ILogger<BrickNTrackContext>>();

                var adminUserName = config["AdminSeed:UserName"] ?? "admin@local.com";
                var adminPassword = config["AdminSeed:Password"] ?? "Admin@12345";

                var existingAdmin = await context.UserManager
                    .IgnoreQueryFilters()
                    .FirstOrDefaultAsync(u => u.UserName == adminUserName);

                if (existingAdmin != null)
                {
                    logger.LogInformation("Admin user '{UserName}' already exists, skipping seed.", adminUserName);
                    return;
                }

                // Ensure a default builder exists for admin
                var defaultBuilder = await context.BuilderMasters
                    .IgnoreQueryFilters()
                    .FirstOrDefaultAsync();

                if (defaultBuilder == null)
                {
                    defaultBuilder = new BuilderMaster
                    {
                        Name = "System",
                        TagLine = "System",
                        Description = "Default",
                        OfficeAddress = "N/A",
                        LangLog = "N/A",
                        EmailAddress = "admin@local.com",
                        Contact1 = "0000000000",
                        Contact2 = "0000000000",
                        GSTNo = "SYSTEM000000",
                        OwnerName = "System",
                        IsActive = true,
                        CreatedBy = "System",
                        CreatedDate = CommonHelper.GetISTTime(DateTime.Now)
                    };
                    context.BuilderMasters.Add(defaultBuilder);
                    await context.SaveChangesAsync();
                }

                var admin = new UserManager
                {
                    UserName = adminUserName,
                    FirstName = "System",
                    LastName = "Admin",
                    Email = "admin@local.com",
                    MobileNumber = "0000000000",
                    PasswordHash = BC.HashPassword(adminPassword),
                    AcceptTerms = true,
                    Role = "Admin",
                    BuilderId = defaultBuilder.BuilderId,
                    IsActive = true,
                    CreatedBy = "System",
                    CreatedDate = CommonHelper.GetISTTime(DateTime.Now)
                };

                context.UserManager.Add(admin);
                await context.SaveChangesAsync();
                logger.LogInformation("Admin user '{UserName}' seeded successfully.", adminUserName);
            }
            catch (Exception ex)
            {
                var logger = serviceProvider.GetService<ILogger<BrickNTrackContext>>();
                logger?.LogWarning(ex, "Failed to seed admin user. The app will continue without it.");
            }
        }

        public static async Task SeedAmenitiesAsync(IServiceProvider serviceProvider)
        {
            try
            {
                using var scope = serviceProvider.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<BrickNTrackContext>();
                var logger = scope.ServiceProvider.GetRequiredService<ILogger<BrickNTrackContext>>();

                if (await context.AmenityMasters.IgnoreQueryFilters().AnyAsync())
                {
                    logger.LogInformation("Amenities already seeded, skipping.");
                    return;
                }

                var now = CommonHelper.GetISTTime(DateTime.Now);
                var amenities = new List<AmenityMaster>
                {
                    // Top Facilities
                    new() { Name = "Swimming Pool", Icon = "fa-solid fa-water-ladder", Category = "Top Facilities", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Gymnasium", Icon = "fa-solid fa-dumbbell", Category = "Top Facilities", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Club House", Icon = "fa-solid fa-house-chimney", Category = "Top Facilities", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Children's Play Area", Icon = "fa-solid fa-child-reaching", Category = "Top Facilities", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Banquet Hall", Icon = "fa-solid fa-champagne-glasses", Category = "Top Facilities", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Gazebo", Icon = "fa-solid fa-tent", Category = "Top Facilities", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Jogging Track", Icon = "fa-solid fa-person-running", Category = "Top Facilities", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Landscaped Gardens", Icon = "fa-solid fa-seedling", Category = "Top Facilities", CreatedBy = "System", CreatedDate = now, IsActive = true },

                    // Sports
                    new() { Name = "Badminton Court", Icon = "fa-solid fa-baseball-bat-ball", Category = "Sports", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Basketball Court", Icon = "fa-solid fa-basketball", Category = "Sports", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Cricket Pitch", Icon = "fa-solid fa-baseball", Category = "Sports", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Lawn Tennis Court", Icon = "fa-solid fa-table-tennis-paddle-ball", Category = "Sports", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Table Tennis", Icon = "fa-solid fa-table-tennis-paddle-ball", Category = "Sports", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Squash Court", Icon = "fa-solid fa-person-running", Category = "Sports", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Skating Rink", Icon = "fa-solid fa-shoe-prints", Category = "Sports", CreatedBy = "System", CreatedDate = now, IsActive = true },

                    // Leisure
                    new() { Name = "Yoga / Meditation Area", Icon = "fa-solid fa-spa", Category = "Leisure", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Sun Deck", Icon = "fa-solid fa-sun", Category = "Leisure", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Party Lawn", Icon = "fa-solid fa-music", Category = "Leisure", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Senior Citizen Sit-out", Icon = "fa-solid fa-bench-tree", Category = "Leisure", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Library / Reading Room", Icon = "fa-solid fa-book-open", Category = "Leisure", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Indoor Games Room", Icon = "fa-solid fa-chess", Category = "Leisure", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Mini Theatre", Icon = "fa-solid fa-film", Category = "Leisure", CreatedBy = "System", CreatedDate = now, IsActive = true },

                    // Security
                    new() { Name = "Gated Community", Icon = "fa-solid fa-building-shield", Category = "Security", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "24/7 Security", Icon = "fa-solid fa-shield-halved", Category = "Security", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "CCTV Surveillance", Icon = "fa-solid fa-video", Category = "Security", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Security Cabin", Icon = "fa-solid fa-house-lock", Category = "Security", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Fire Fighting Systems", Icon = "fa-solid fa-fire-extinguisher", Category = "Security", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Intercom", Icon = "fa-solid fa-phone-volume", Category = "Security", CreatedBy = "System", CreatedDate = now, IsActive = true },

                    // Convenience
                    new() { Name = "Car Parking", Icon = "fa-solid fa-square-parking", Category = "Convenience", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Lifts", Icon = "fa-solid fa-elevator", Category = "Convenience", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Shopping Centre", Icon = "fa-solid fa-bag-shopping", Category = "Convenience", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Waiting Lounge", Icon = "fa-solid fa-couch", Category = "Convenience", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Salon", Icon = "fa-solid fa-scissors", Category = "Convenience", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Laundry", Icon = "fa-solid fa-shirt", Category = "Convenience", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Car Wash Area", Icon = "fa-solid fa-car-side", Category = "Convenience", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Bus Shelter", Icon = "fa-solid fa-bus", Category = "Convenience", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "EV Charging Station", Icon = "fa-solid fa-charging-station", Category = "Convenience", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "ATM", Icon = "fa-solid fa-money-bill-wave", Category = "Convenience", CreatedBy = "System", CreatedDate = now, IsActive = true },

                    // Utilities
                    new() { Name = "24/7 Power Backup", Icon = "fa-solid fa-bolt", Category = "Utilities", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "24/7 Water Supply", Icon = "fa-solid fa-droplet", Category = "Utilities", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Rainwater Harvesting", Icon = "fa-solid fa-cloud-rain", Category = "Utilities", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Sewage Treatment Plant", Icon = "fa-solid fa-recycle", Category = "Utilities", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Waste Management", Icon = "fa-solid fa-trash-can", Category = "Utilities", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Solar Panels", Icon = "fa-solid fa-solar-panel", Category = "Utilities", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Gas Pipeline", Icon = "fa-solid fa-fire-burner", Category = "Utilities", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Wi-Fi Connectivity", Icon = "fa-solid fa-wifi", Category = "Utilities", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Paved Compound", Icon = "fa-solid fa-road", Category = "Utilities", CreatedBy = "System", CreatedDate = now, IsActive = true },
                    new() { Name = "Internal Street Lights", Icon = "fa-solid fa-lightbulb", Category = "Utilities", CreatedBy = "System", CreatedDate = now, IsActive = true },
                };

                context.AmenityMasters.AddRange(amenities);
                await context.SaveChangesAsync();
                logger.LogInformation("Seeded {Count} amenities.", amenities.Count);
            }
            catch (Exception ex)
            {
                var logger = serviceProvider.GetService<ILogger<BrickNTrackContext>>();
                logger?.LogWarning(ex, "Failed to seed amenities.");
            }
        }
    }
}
