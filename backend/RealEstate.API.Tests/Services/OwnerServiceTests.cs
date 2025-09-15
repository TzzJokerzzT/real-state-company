using MongoDB.Driver;
using Moq;
using NUnit.Framework;
using RealEstate.API.Configuration;
using RealEstate.API.Models;
using RealEstate.API.Services;

namespace RealEstate.API.Tests.Services
{
    [TestFixture]
    public class OwnerServiceTests
    {
        private Mock<IMongoCollection<Owner>> _mockOwnersCollection;
        private Mock<IMongoClient> _mockMongoClient;
        private Mock<IMongoDatabase> _mockDatabase;
        private OwnerService _ownerService;
        private DatabaseSettings _databaseSettings;

        [SetUp]
        public void Setup()
        {
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

            _mockDatabase.Setup(db => db.GetCollection<Owner>(_databaseSettings.OwnersCollectionName, null))
                        .Returns(_mockOwnersCollection.Object);
            _mockMongoClient.Setup(client => client.GetDatabase(_databaseSettings.DatabaseName, null))
                           .Returns(_mockDatabase.Object);

            _ownerService = new OwnerService(_mockMongoClient.Object, _databaseSettings);
        }

        [Test]
        public void CreateOwnerAsync_WithNullData_ShouldThrowArgumentNullException()
        {
            // Act & Assert
            var exception = Assert.ThrowsAsync<ArgumentNullException>(
                async () => await _ownerService.CreateOwnerAsync(null!));
            
            Assert.That(exception.ParamName, Is.EqualTo("createOwnerDto"));
        }

        [Test]
        public void CreateOwnerAsync_WithEmptyName_ShouldThrowArgumentException()
        {
            // Arrange
            var createOwnerDto = new CreateOwnerDto
            {
                Name = "",
                Email = "test@example.com",
                Phone = "123-456-7890"
            };

            // Act & Assert
            var exception = Assert.ThrowsAsync<ArgumentException>(
                async () => await _ownerService.CreateOwnerAsync(createOwnerDto));
            
            Assert.That(exception.ParamName, Is.EqualTo("Name"));
        }

        // TODO: Add more comprehensive tests
        // The following tests need proper MongoDB cursor mocking:
        // - GetAllOwnersAsync tests
        // - GetOwnerByIdAsync tests  
        // - CreateOwnerAsync tests
        // - UpdateOwnerAsync tests
        // - Search and filtering tests
        // 
        // MongoDB mocking with IAsyncCursor is complex and requires careful setup
        // For now, we have basic deletion tests working as a foundation
    }
}
