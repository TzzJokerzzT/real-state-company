using Microsoft.AspNetCore.Mvc;
using RealEstate.API.Models;
using RealEstate.API.Services;

namespace RealEstate.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PropertiesController : ControllerBase
    {
        private readonly IPropertyService _propertyService;
        private readonly ILogger<PropertiesController> _logger;

        public PropertiesController(IPropertyService propertyService, ILogger<PropertiesController> logger)
        {
            _propertyService = propertyService;
            _logger = logger;
        }

        /// <summary>
        /// Get all properties
        /// </summary>
        /// <returns>List of all properties</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PropertyDto>>> GetProperties()
        {
            try
            {
                var properties = await _propertyService.GetAllPropertiesAsync();
                return Ok(properties);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving properties");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get properties with filtering and pagination
        /// </summary>
        /// <param name="filter">Filter parameters</param>
        /// <returns>Filtered and paginated list of properties</returns>
        [HttpGet("search")]
        public async Task<ActionResult<object>> GetPropertiesByFilter([FromQuery] PropertyFilterDto filter)
        {
            try
            {
                var properties = await _propertyService.GetPropertiesByFilterAsync(filter);
                var totalCount = await _propertyService.GetPropertiesCountAsync(filter);
                
                var result = new
                {
                    Properties = properties,
                    TotalCount = totalCount,
                    Page = filter.Page,
                    PageSize = filter.PageSize,
                    TotalPages = (int)Math.Ceiling((double)totalCount / filter.PageSize)
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving filtered properties");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get a specific property by ID
        /// </summary>
        /// <param name="id">Property ID</param>
        /// <returns>Property details</returns>
        [HttpGet("{id}")]
        public async Task<ActionResult<PropertyDto>> GetProperty(string id)
        {
            try
            {
                var property = await _propertyService.GetPropertyByIdAsync(id);
                if (property == null)
                {
                    return NotFound($"Property with ID {id} not found");
                }
                return Ok(property);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving property with ID {PropertyId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Create a new property
        /// </summary>
        /// <param name="createPropertyDto">Property data</param>
        /// <returns>Created property</returns>
        [HttpPost]
        [ProducesResponseType(typeof(PropertyDto), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<PropertyDto>> CreateProperty([FromBody] CreatePropertyDto createPropertyDto)
        {
            try
            {
                // Validar el modelo
                if (!ModelState.IsValid)
                {
                    _logger.LogWarning("Invalid model state when creating property: {ModelState}", 
                        string.Join(", ", ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage)));
                    return BadRequest(new { 
                        message = "Datos de entrada inválidos", 
                        errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) 
                    });
                }

                // Validar que el propietario existe (opcional, dependiendo de tu lógica de negocio)
                if (string.IsNullOrWhiteSpace(createPropertyDto.IdOwner))
                {
                    _logger.LogWarning("Attempt to create property with empty owner ID");
                    return BadRequest(new { message = "El ID del propietario es requerido" });
                }

                // Validar que el precio sea positivo
                if (createPropertyDto.Price <= 0)
                {
                    _logger.LogWarning("Attempt to create property with invalid price: {Price}", createPropertyDto.Price);
                    return BadRequest(new { message = "El precio debe ser mayor a 0" });
                }

                _logger.LogInformation("Creating new property: {PropertyName} for owner {OwnerId}", 
                    createPropertyDto.Name, createPropertyDto.IdOwner);

                var property = await _propertyService.CreatePropertyAsync(createPropertyDto);
                
                _logger.LogInformation("Property created successfully with ID: {PropertyId}", property.Id);
                
                return CreatedAtAction(nameof(GetProperty), new { id = property.Id }, property);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(ex, "Invalid argument when creating property: {Message}", ex.Message);
                return BadRequest(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                _logger.LogWarning(ex, "Invalid operation when creating property: {Message}", ex.Message);
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error creating property for owner {OwnerId}", createPropertyDto?.IdOwner);
                return StatusCode(500, new { message = "Error interno del servidor al crear la propiedad" });
            }
        }

        /// <summary>
        /// Update an existing property
        /// </summary>
        /// <param name="id">Property ID</param>
        /// <param name="updatePropertyDto">Updated property data</param>
        /// <returns>Updated property</returns>
        [HttpPut("{id}")]
        public async Task<ActionResult<PropertyDto>> UpdateProperty(string id, [FromBody] UpdatePropertyDto updatePropertyDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                var property = await _propertyService.UpdatePropertyAsync(id, updatePropertyDto);
                if (property == null)
                {
                    return NotFound($"Property with ID {id} not found");
                }

                return Ok(property);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating property with ID {PropertyId}", id);
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Delete a property
        /// </summary>
        /// <param name="id">Property ID</param>
        /// <returns>Success status</returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProperty(string id)
        {
            try
            {
                var result = await _propertyService.DeletePropertyAsync(id);
                if (!result)
                {
                    return NotFound($"Property with ID {id} not found");
                }

                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting property with ID {PropertyId}", id);
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
