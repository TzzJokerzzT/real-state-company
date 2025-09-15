using MongoDB.Driver;
using MongoDB.Bson;
using RealEstate.API.Configuration;
using RealEstate.API.Models;

namespace RealEstate.API.Data
{
    public static class SeedData
    {
        public static async Task SeedAsync(IMongoClient mongoClient, DatabaseSettings databaseSettings)
        {
            var database = mongoClient.GetDatabase(databaseSettings.DatabaseName);
            var propertiesCollection = database.GetCollection<Property>(databaseSettings.PropertiesCollectionName);
            var ownersCollection = database.GetCollection<Owner>(databaseSettings.OwnersCollectionName);

            // Check if data already exists
            var existingProperties = await propertiesCollection.CountDocumentsAsync(property => true);
            if (existingProperties > 0)
            {
                return; // Data already seeded
            }

            // Seed owners
            var owner1Id = ObjectId.GenerateNewId().ToString();
            var owner2Id = ObjectId.GenerateNewId().ToString();
            var owner3Id = ObjectId.GenerateNewId().ToString();
            var owner4Id = ObjectId.GenerateNewId().ToString();
            var owner5Id = ObjectId.GenerateNewId().ToString();

            var owners = new List<Owner>
            {
                new Owner
                {
                    Id = owner1Id,
                    Name = "John Smith",
                    Email = "john.smith@email.com",
                    Phone = "+1-555-0101",
                    CreatedAt = DateTime.UtcNow.AddDays(-30)
                },
                new Owner
                {
                    Id = owner2Id,
                    Name = "Sarah Johnson",
                    Email = "sarah.johnson@email.com",
                    Phone = "+1-555-0102",
                    CreatedAt = DateTime.UtcNow.AddDays(-25)
                },
                new Owner
                {
                    Id = owner3Id,
                    Name = "Michael Brown",
                    Email = "michael.brown@email.com",
                    Phone = "+1-555-0103",
                    CreatedAt = DateTime.UtcNow.AddDays(-20)
                },
                new Owner
                {
                    Id = owner4Id,
                    Name = "Emily Davis",
                    Email = "emily.davis@email.com",
                    Phone = "+1-555-0104",
                    CreatedAt = DateTime.UtcNow.AddDays(-15)
                },
                new Owner
                {
                    Id = owner5Id,
                    Name = "David Wilson",
                    Email = "david.wilson@email.com",
                    Phone = "+1-555-0105",
                    CreatedAt = DateTime.UtcNow.AddDays(-10)
                }
            };

            await ownersCollection.InsertManyAsync(owners);

            // Seed properties
            var properties = new List<Property>
            {
                new Property
                {
                    IdOwner = owner1Id,
                    Name = "Modern Downtown Apartment",
                    Address = "123 Main Street, New York, NY 10001",
                    Price = 750000,
                    Image = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
                    CreatedAt = DateTime.UtcNow.AddDays(-30),
                    UpdatedAt = DateTime.UtcNow.AddDays(-30)
                },
                new Property
                {
                    IdOwner = owner1Id,
                    Name = "Luxury Penthouse Suite",
                    Address = "456 Park Avenue, New York, NY 10022",
                    Price = 2500000,
                    Image = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
                    CreatedAt = DateTime.UtcNow.AddDays(-28),
                    UpdatedAt = DateTime.UtcNow.AddDays(-28)
                },
                new Property
                {
                    IdOwner = owner2Id,
                    Name = "Cozy Suburban House",
                    Address = "789 Oak Street, Brooklyn, NY 11201",
                    Price = 650000,
                    Image = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
                    CreatedAt = DateTime.UtcNow.AddDays(-25),
                    UpdatedAt = DateTime.UtcNow.AddDays(-25)
                },
                new Property
                {
                    IdOwner = owner2Id,
                    Name = "Historic Brownstone",
                    Address = "321 Elm Avenue, Manhattan, NY 10003",
                    Price = 1200000,
                    Image = "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800",
                    CreatedAt = DateTime.UtcNow.AddDays(-22),
                    UpdatedAt = DateTime.UtcNow.AddDays(-22)
                },
                new Property
                {
                    IdOwner = owner3Id,
                    Name = "Waterfront Condo",
                    Address = "555 Harbor View, Long Island City, NY 11101",
                    Price = 950000,
                    Image = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
                    CreatedAt = DateTime.UtcNow.AddDays(-20),
                    UpdatedAt = DateTime.UtcNow.AddDays(-20)
                },
                new Property
                {
                    IdOwner = owner3Id,
                    Name = "Garden Apartment",
                    Address = "777 Garden Lane, Queens, NY 11375",
                    Price = 450000,
                    Image = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
                    CreatedAt = DateTime.UtcNow.AddDays(-18),
                    UpdatedAt = DateTime.UtcNow.AddDays(-18)
                },
                new Property
                {
                    IdOwner = owner4Id,
                    Name = "Executive Loft",
                    Address = "999 Business District, Manhattan, NY 10016",
                    Price = 1800000,
                    Image = "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
                    CreatedAt = DateTime.UtcNow.AddDays(-15),
                    UpdatedAt = DateTime.UtcNow.AddDays(-15)
                },
                new Property
                {
                    IdOwner = owner4Id,
                    Name = "Family Townhouse",
                    Address = "111 Residential Road, Staten Island, NY 10301",
                    Price = 850000,
                    Image = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
                    CreatedAt = DateTime.UtcNow.AddDays(-12),
                    UpdatedAt = DateTime.UtcNow.AddDays(-12)
                },
                new Property
                {
                    IdOwner = owner5Id,
                    Name = "Studio Apartment",
                    Address = "222 Student Street, Bronx, NY 10451",
                    Price = 350000,
                    Image = "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
                    CreatedAt = DateTime.UtcNow.AddDays(-10),
                    UpdatedAt = DateTime.UtcNow.AddDays(-10)
                },
                new Property
                {
                    IdOwner = owner5Id,
                    Name = "Luxury Villa",
                    Address = "333 Estate Drive, Westchester, NY 10583",
                    Price = 3200000,
                    Image = "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
                    CreatedAt = DateTime.UtcNow.AddDays(-8),
                    UpdatedAt = DateTime.UtcNow.AddDays(-8)
                },
                new Property
                {
                    IdOwner = "owner1",
                    Name = "City View Apartment",
                    Address = "444 Skyline Boulevard, Manhattan, NY 10017",
                    Price = 1100000,
                    Image = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
                    CreatedAt = DateTime.UtcNow.AddDays(-5),
                    UpdatedAt = DateTime.UtcNow.AddDays(-5)
                },
                new Property
                {
                    IdOwner = owner2Id,
                    Name = "Riverside Condo",
                    Address = "666 River Road, Brooklyn, NY 11222",
                    Price = 720000,
                    Image = "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
                    CreatedAt = DateTime.UtcNow.AddDays(-3),
                    UpdatedAt = DateTime.UtcNow.AddDays(-3)
                }
            };

            await propertiesCollection.InsertManyAsync(properties);
        }
    }
}
