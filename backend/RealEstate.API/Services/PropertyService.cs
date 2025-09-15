using MongoDB.Driver;
using RealEstate.API.Configuration;
using RealEstate.API.Models;

namespace RealEstate.API.Services
{
    public class PropertyService : IPropertyService
    {
        private readonly IMongoCollection<Property> _properties;
        private readonly IMongoCollection<Owner> _owners;

        public PropertyService(IMongoClient mongoClient, DatabaseSettings databaseSettings)
        {
            var database = mongoClient.GetDatabase(databaseSettings.DatabaseName);
            _properties = database.GetCollection<Property>(databaseSettings.PropertiesCollectionName);
            _owners = database.GetCollection<Owner>(databaseSettings.OwnersCollectionName);
        }

        public async Task<IEnumerable<PropertyDto>> GetAllPropertiesAsync()
        {
            var properties = await _properties.Find(property => true).ToListAsync();
            return properties.Select(MapToDto);
        }

        public async Task<PropertyDto?> GetPropertyByIdAsync(string id)
        {
            var property = await _properties.Find(p => p.Id == id).FirstOrDefaultAsync();
            return property != null ? MapToDto(property) : null;
        }

        public async Task<IEnumerable<PropertyDto>> GetPropertiesByFilterAsync(PropertyFilterDto filter)
        {
            var filterBuilder = Builders<Property>.Filter;
            var filters = new List<FilterDefinition<Property>>();

            if (!string.IsNullOrEmpty(filter.Name))
            {
                filters.Add(filterBuilder.Regex(p => p.Name, new MongoDB.Bson.BsonRegularExpression(filter.Name, "i")));
            }

            if (!string.IsNullOrEmpty(filter.Address))
            {
                filters.Add(filterBuilder.Regex(p => p.Address, new MongoDB.Bson.BsonRegularExpression(filter.Address, "i")));
            }

            if (!string.IsNullOrEmpty(filter.IdOwner))
            {
                filters.Add(filterBuilder.Eq(p => p.IdOwner, filter.IdOwner));
            }

            if (filter.MinPrice.HasValue)
            {
                filters.Add(filterBuilder.Gte(p => p.Price, filter.MinPrice.Value));
            }

            if (filter.MaxPrice.HasValue)
            {
                filters.Add(filterBuilder.Lte(p => p.Price, filter.MaxPrice.Value));
            }

            var combinedFilter = filters.Any() ? filterBuilder.And(filters) : filterBuilder.Empty;

            var skip = (filter.Page - 1) * filter.PageSize;
            var properties = await _properties
                .Find(combinedFilter)
                .Skip(skip)
                .Limit(filter.PageSize)
                .SortByDescending(p => p.CreatedAt)
                .ToListAsync();

            return properties.Select(MapToDto);
        }

        public async Task<PropertyDto> CreatePropertyAsync(CreatePropertyDto createPropertyDto)
        {
            // Validaciones adicionales de negocio
            if (createPropertyDto == null)
                throw new ArgumentNullException(nameof(createPropertyDto), "Los datos de la propiedad no pueden ser nulos");

            if (string.IsNullOrWhiteSpace(createPropertyDto.Name))
                throw new ArgumentException("El nombre de la propiedad es requerido", nameof(createPropertyDto.Name));

            if (string.IsNullOrWhiteSpace(createPropertyDto.Address))
                throw new ArgumentException("La dirección de la propiedad es requerida", nameof(createPropertyDto.Address));

            if (createPropertyDto.Price <= 0)
                throw new ArgumentException("El precio debe ser mayor a 0", nameof(createPropertyDto.Price));

            if (string.IsNullOrWhiteSpace(createPropertyDto.IdOwner))
                throw new ArgumentException("El ID del propietario es requerido", nameof(createPropertyDto.IdOwner));

            // Verificar que el propietario existe (opcional)
            var ownerExists = await _owners.Find(o => o.Id == createPropertyDto.IdOwner).AnyAsync();
            if (!ownerExists)
                throw new InvalidOperationException($"No se encontró un propietario con ID: {createPropertyDto.IdOwner}");

            // Verificar que no existe una propiedad con el mismo nombre para el mismo propietario
            var existingProperty = await _properties.Find(p => p.Name == createPropertyDto.Name && p.IdOwner == createPropertyDto.IdOwner).FirstOrDefaultAsync();
            if (existingProperty != null)
                throw new InvalidOperationException($"Ya existe una propiedad con el nombre '{createPropertyDto.Name}' para este propietario");

            var property = new Property
            {
                IdOwner = createPropertyDto.IdOwner.Trim(),
                Name = createPropertyDto.Name.Trim(),
                Address = createPropertyDto.Address.Trim(),
                Price = createPropertyDto.Price,
                Image = createPropertyDto.Image?.Trim() ?? string.Empty,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _properties.InsertOneAsync(property);
            return MapToDto(property);
        }

        public async Task<PropertyDto?> UpdatePropertyAsync(string id, UpdatePropertyDto updatePropertyDto)
        {
            var property = new Property
            {
                Id = id,
                IdOwner = updatePropertyDto.IdOwner,
                Name = updatePropertyDto.Name,
                Address = updatePropertyDto.Address,
                Price = updatePropertyDto.Price,
                Image = updatePropertyDto.Image,
                UpdatedAt = DateTime.UtcNow
            };

            var result = await _properties.ReplaceOneAsync(p => p.Id == id, property);
            return result.IsAcknowledged && result.ModifiedCount > 0 ? MapToDto(property) : null;
        }

        public async Task<bool> DeletePropertyAsync(string id)
        {
            var result = await _properties.DeleteOneAsync(p => p.Id == id);
            return result.IsAcknowledged && result.DeletedCount > 0;
        }

        public async Task<long> GetPropertiesCountAsync(PropertyFilterDto? filter = null)
        {
            if (filter == null)
            {
                return await _properties.CountDocumentsAsync(property => true);
            }

            var filterBuilder = Builders<Property>.Filter;
            var filters = new List<FilterDefinition<Property>>();

            if (!string.IsNullOrEmpty(filter.Name))
            {
                filters.Add(filterBuilder.Regex(p => p.Name, new MongoDB.Bson.BsonRegularExpression(filter.Name, "i")));
            }

            if (!string.IsNullOrEmpty(filter.Address))
            {
                filters.Add(filterBuilder.Regex(p => p.Address, new MongoDB.Bson.BsonRegularExpression(filter.Address, "i")));
            }

            if (!string.IsNullOrEmpty(filter.IdOwner))
            {
                filters.Add(filterBuilder.Eq(p => p.IdOwner, filter.IdOwner));
            }

            if (filter.MinPrice.HasValue)
            {
                filters.Add(filterBuilder.Gte(p => p.Price, filter.MinPrice.Value));
            }

            if (filter.MaxPrice.HasValue)
            {
                filters.Add(filterBuilder.Lte(p => p.Price, filter.MaxPrice.Value));
            }

            var combinedFilter = filters.Any() ? filterBuilder.And(filters) : filterBuilder.Empty;
            return await _properties.CountDocumentsAsync(combinedFilter);
        }

        private static PropertyDto MapToDto(Property property)
        {
            return new PropertyDto
            {
                Id = property.Id,
                IdOwner = property.IdOwner,
                Name = property.Name,
                Address = property.Address,
                Price = property.Price,
                Image = property.Image,
                CreatedAt = property.CreatedAt,
                UpdatedAt = property.UpdatedAt
            };
        }
    }
}
