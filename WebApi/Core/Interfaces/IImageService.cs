using Microsoft.AspNetCore.Http;

namespace Core.Interfaces
{
    public interface IImageService
    {
        Task<string> SaveImageAsync(byte[] bytes);
        Task<string> SaveImageAsync(IFormFile image);
        Task<string> SaveImageAsync(string base64);
        Task<string> SaveImageFromUrlAsync(string imageUrl);
        Task<List<string>> SaveImagesAsync(IEnumerable<byte[]> bytesArrays);
        Task<List<string>> SaveImagesAsync(IEnumerable<IFormFile> images);
        Task<byte[]> LoadBytesAsync(string name);
        void DeleteImage(string nameWithFormat);
        void DeleteImageIfExists(string nameWithFormat);
        void DeleteImages(IEnumerable<string> images);
        void DeleteImagesIfExists(IEnumerable<string> images);
    }
}
