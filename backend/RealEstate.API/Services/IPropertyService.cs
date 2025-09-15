using RealEstate.API.Models;

namespace RealEstate.API.Services
{
    public interface IPropertyService
    {
        Task<IEnumerable<PropertyDto>> GetAllPropertiesAsync();
        Task<PropertyDto?> GetPropertyByIdAsync(string id);
        Task<IEnumerable<PropertyDto>> GetPropertiesByFilterAsync(PropertyFilterDto filter);
        Task<PropertyDto> CreatePropertyAsync(CreatePropertyDto createPropertyDto);
        Task<PropertyDto?> UpdatePropertyAsync(string id, UpdatePropertyDto updatePropertyDto);
        Task<bool> DeletePropertyAsync(string id);
        Task<long> GetPropertiesCountAsync(PropertyFilterDto? filter = null);
    }
}
