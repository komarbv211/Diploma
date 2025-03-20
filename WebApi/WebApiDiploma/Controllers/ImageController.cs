using Microsoft.AspNetCore.Mvc;
using Core.Interfaces;

namespace WebApiDiploma.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ImageUploadController : ControllerBase
    {
        private readonly IImageService _imageService;

        public ImageUploadController(IImageService imageService)
        {
            _imageService = imageService;
        }

        // Метод для завантаження одного зображення
        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage(IFormFile image)
        {
            if (image == null || image.Length == 0)
            {
                return BadRequest("No image selected.");
            }

            try
            {
                var imageUrl = await _imageService.SaveImageAsync(image);
                return Ok(new { Message = "Image successfully uploaded", ImageUrl = imageUrl });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error loading image", Error = ex.Message });
            }
        }

        // Метод для завантаження кількох зображень
        [HttpPost("uploadMultiple")]
        public async Task<IActionResult> UploadImages(IEnumerable<IFormFile> images)
        {
            if (images == null || !images.Any())
            {
                return BadRequest("No image selected.");
            }

            try
            {
                var imageUrls = await _imageService.SaveImagesAsync(images);
                return Ok(new { Message = "Image successfully uploaded", ImageUrls = imageUrls });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error loading images", Error = ex.Message });
            }
        }
        // Метод для видалення одного зображення
        [HttpDelete("delete/{imageName}")]
        public IActionResult DeleteImage(string imageName)
        {
            if (string.IsNullOrEmpty(imageName))
            {
                return BadRequest("The name of the image to be deleted was not specified.");
            }

            try
            {
                _imageService.DeleteImageIfExists(imageName);
                return Ok(new { Message = "Image successfully deleted" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error deleting image", Error = ex.Message });
            }
        }

        // Метод для видалення кількох зображень
        [HttpDelete("deleteMultiple")]
        public IActionResult DeleteImages([FromBody] IEnumerable<string> imageNames)
        {
            if (imageNames == null || !imageNames.Any())
            {
                return BadRequest("The name of the image to be deleted was not specified.");
            }

            try
            {
                _imageService.DeleteImagesIfExists(imageNames);
                return Ok(new { Message = "Image successfully deleted" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Error deleting images", Error = ex.Message });
            }
        }
    }
}

