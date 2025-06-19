using Microsoft.AspNetCore.Mvc;

namespace MassivoProject.Server.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private readonly IWebHostEnvironment _environment;

        public FileController(IWebHostEnvironment environment)
        {
            _environment = environment;
        }

        // FileController.cs
        [HttpPost("upload/{entityType}")]
        public async Task<IActionResult> Upload(IFormFile file, string entityType)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No se ha proporcionado ningún archivo");

            try
            {
                // Asegurarse de que exista la carpeta wwwroot
                string wwwrootPath = _environment.WebRootPath;
                if (string.IsNullOrEmpty(wwwrootPath))
                {
                    wwwrootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                    Directory.CreateDirectory(wwwrootPath);
                }

                // Asegurarse de que exista la carpeta uploads
                string uploadsFolder = Path.Combine(wwwrootPath, "uploads");
                Directory.CreateDirectory(uploadsFolder);

                // Asegurarse de que exista la carpeta para la entidad
                string entityFolder = Path.Combine(uploadsFolder, entityType);
                Directory.CreateDirectory(entityFolder);

                // Generar nombre único para el archivo
                string uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
                string filePath = Path.Combine(entityFolder, uniqueFileName);

                // Guardar archivo
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                // Devolver URL relativa
                var baseUrl = $"{Request.Scheme}://{Request.Host}";
                string fileUrl = $"{baseUrl}/uploads/{entityType}/{uniqueFileName}";
                return Ok(new { url = fileUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error interno: {ex.Message}");
            }
        }




    }
}
