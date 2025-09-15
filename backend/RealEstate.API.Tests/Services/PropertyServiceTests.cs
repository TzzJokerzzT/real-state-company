using MongoDB.Driver;
using Moq;
using NUnit.Framework;
using RealEstate.API.Configuration;
using RealEstate.API.Models;
using RealEstate.API.Services;

namespace RealEstate.API.Tests.Services
{
    [TestFixture]
    public class PropertyServiceTests
    {
        private Mock<IMongoCollection<Property>> _mockPropertiesCollection;
        private Mock<IMongoCollection<Owner>> _mockOwnersCollection;
        private Mock<IMongoClient> _mockMongoClient;
        private Mock<IMongoDatabase> _mockDatabase;
        private PropertyService _propertyService;
        private DatabaseSettings _databaseSettings;

        [SetUp]
        public void Setup()
        {
            _mockPropertiesCollection = new Mock<IMongoCollection<Property>>();
            _mockOwnersCollection = new Mock<IMongoCollection<Owner>>();
            _mockDatabase = new Mock<IMongoDatabase>();
            _mockMongoClient = new Mock<IMongoClient>();

            _databaseSettings = new DatabaseSettings
            {
                ConnectionString = "mongodb://localhost:27017",
                DatabaseName = "TestDB",
                PropertiesCollectionName = "Properties",
                OwnersCollectionName = "Owners"
            };

            _mockDatabase.Setup(db => db.GetCollection<Property>(_databaseSettings.PropertiesCollectionName, null))
                        .Returns(_mockPropertiesCollection.Object);
            _mockDatabase.Setup(db => db.GetCollection<Owner>(_databaseSettings.OwnersCollectionName, null))
                        .Returns(_mockOwnersCollection.Object);
            _mockMongoClient.Setup(client => client.GetDatabase(_databaseSettings.DatabaseName, null))
                           .Returns(_mockDatabase.Object);

            _propertyService = new PropertyService(_mockMongoClient.Object, _databaseSettings);
        }

        [Test]
        public async Task DeletePropertyAsync_WithValidId_ShouldReturnTrue()
        {
            // Arrange
            var propertyId = "1";
            var mockDeleteResult = new Mock<DeleteResult>();
            mockDeleteResult.Setup(r => r.IsAcknowledged).Returns(true);
            mockDeleteResult.Setup(r => r.DeletedCount).Returns(1);

            _mockPropertiesCollection.Setup(collection => collection.DeleteOneAsync(
                It.IsAny<FilterDefinition<Property>>(),
                It.IsAny<CancellationToken>()))
                .ReturnsAsync(mockDeleteResult.Object);

            // Act
            var result = await _propertyService.DeletePropertyAsync(propertyId);

            // Assert
            Assert.That(result, Is.True);
        }

        [Test]
        public async Task DeletePropertyAsync_WithInvalidId_ShouldReturnFalse()
        {
            // Arrange
            var propertyId = "999";
            var mockDeleteResult = new Mock<DeleteResult>();
            mockDeleteResult.Setup(r => r.IsAcknowledged).Returns(true);
            mockDeleteResult.Setup(r => r.DeletedCount).Returns(0);

            _mockPropertiesCollection.Setup(collection => collection.DeleteOneAsync(
                It.IsAny<FilterDefinition<Property>>(),
                It.IsAny<CancellationToken>()))
                .ReturnsAsync(mockDeleteResult.Object);

            // Act
            var result = await _propertyService.DeletePropertyAsync(propertyId);

            // Assert
            Assert.That(result, Is.False);
        }

        // TODO: Add more comprehensive tests
        // The following tests need proper MongoDB cursor mocking:
        // - GetAllPropertiesAsync tests
        // - GetPropertyByIdAsync tests  
        // - CreatePropertyAsync tests
        // - UpdatePropertyAsync tests
        // - Search and filtering tests
        // 
        // MongoDB mocking with IAsyncCursor is complex and requires careful setup
        // For now, we have basic deletion tests working as a foundation
    }
}
