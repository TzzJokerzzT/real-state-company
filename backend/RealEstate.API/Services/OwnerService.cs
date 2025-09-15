using MongoDB.Driver;
using RealEstate.API.Configuration;
using RealEstate.API.Models;

namespace RealEstate.API.Services
{
    public class OwnerService : IOwnerService
    {
        private readonly IMongoCollection<Owner> _owners;

        public OwnerService(IMongoClient mongoClient, DatabaseSettings databaseSettings)
        {
            var database = mongoClient.GetDatabase(databaseSettings.DatabaseName);
            _owners = database.GetCollection<Owner>(databaseSettings.OwnersCollectionName);
        }

        public async Task<IEnumerable<OwnerDto>> GetAllOwnersAsync()
        {
            var owners = await _owners.Find(owner => true).SortByDescending(o => o.CreatedAt).ToListAsync();
            return owners.Select(MapToDto);
        }

        public async Task<OwnerDto?> GetOwnerByIdAsync(string id)
        {
            var owner = await _owners.Find(o => o.Id == id).FirstOrDefaultAsync();
            return owner != null ? MapToDto(owner) : null;
        }

        public async Task<OwnerDto> CreateOwnerAsync(CreateOwnerDto createOwnerDto)
        {
            if (createOwnerDto == null)
                throw new ArgumentNullException(nameof(createOwnerDto), "Los datos del propietario no pueden ser nulos");

            if (string.IsNullOrWhiteSpace(createOwnerDto.Name))
                throw new ArgumentException("El nombre es requerido", nameof(createOwnerDto.Name));

            if (string.IsNullOrWhiteSpace(createOwnerDto.Email))
                throw new ArgumentException("El email es requerido", nameof(createOwnerDto.Email));

            if (string.IsNullOrWhiteSpace(createOwnerDto.Phone))
                throw new ArgumentException("El teléfono es requerido", nameof(createOwnerDto.Phone));

            // Validar unicidad de email
            var emailExists = await _owners.Find(o => o.Email == createOwnerDto.Email).AnyAsync();
            if (emailExists)
                throw new InvalidOperationException($"Ya existe un propietario con el email '{createOwnerDto.Email}'");

            var owner = new Owner
            {
                Name = createOwnerDto.Name.Trim(),
                Email = createOwnerDto.Email.Trim(),
                Phone = createOwnerDto.Phone.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            await _owners.InsertOneAsync(owner);
            return MapToDto(owner);
        }

        private static OwnerDto MapToDto(Owner owner)
        {
            return new OwnerDto
            {
                Id = owner.Id,
                Name = owner.Name,
                Email = owner.Email,
                Phone = owner.Phone,
                CreatedAt = owner.CreatedAt
            };
        }
    }
}


