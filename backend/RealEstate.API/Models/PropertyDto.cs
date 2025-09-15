using System.ComponentModel.DataAnnotations;

namespace RealEstate.API.Models
{
    public class PropertyDto
    {
        public string? Id { get; set; }
        public string IdOwner { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Image { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

    public class CreatePropertyDto
    {
        [Required(ErrorMessage = "El ID del propietario es requerido")]
        [StringLength(50, ErrorMessage = "El ID del propietario no puede exceder 50 caracteres")]
        public string IdOwner { get; set; } = string.Empty;

        [Required(ErrorMessage = "El nombre de la propiedad es requerido")]
        [StringLength(100, MinimumLength = 2, ErrorMessage = "El nombre debe tener entre 2 y 100 caracteres")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "La dirección es requerida")]
        [StringLength(200, MinimumLength = 5, ErrorMessage = "La dirección debe tener entre 5 y 200 caracteres")]
        public string Address { get; set; } = string.Empty;

        [Required(ErrorMessage = "El precio es requerido")]
        [Range(0.01, double.MaxValue, ErrorMessage = "El precio debe ser mayor a 0")]
        public decimal Price { get; set; }

        [Required(ErrorMessage = "La imagen es requerida")]
        [Url(ErrorMessage = "La imagen debe ser una URL válida")]
        public string Image { get; set; } = string.Empty;
    }

    public class UpdatePropertyDto
    {
        public string? Id { get; set; }
        public string IdOwner { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string Image { get; set; } = string.Empty;
    }

    public class PropertyFilterDto
    {
        public string? Name { get; set; }
        public string? Address { get; set; }
        public decimal? MinPrice { get; set; }
        public decimal? MaxPrice { get; set; }
        public string? IdOwner { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
