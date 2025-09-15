// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to the real_state database (to align with appsettings)
db = db.getSiblingDB("real_state");

// Create collections
db.createCollection("Properties");
db.createCollection("Owners");

// Create indexes for better performance
db.Properties.createIndex({ name: "text", address: "text" });
db.Properties.createIndex({ price: 1 });
db.Properties.createIndex({ idOwner: 1 });
db.Properties.createIndex({ createdAt: -1 });

db.Owners.createIndex({ name: 1 });
db.Owners.createIndex({ email: 1 });

print("MongoDB initialization completed successfully!");
