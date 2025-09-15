using RealEstate.API.Models;

namespace RealEstate.API.Services
{
    public interface IOwnerService
    {
        Task<IEnumerable<OwnerDto>> GetAllOwnersAsync();
        Task<OwnerDto?> GetOwnerByIdAsync(string id);
        Task<OwnerDto> CreateOwnerAsync(CreateOwnerDto createOwnerDto);
    }
}


