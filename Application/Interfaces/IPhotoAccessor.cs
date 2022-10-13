using Application.Photos;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IPhotoAccessor
    {

        Task<PhotoUploadedResult> AddPhotoAsync(IFormFile file);
        Task<string> DeletePhotoAsync(string publicId);
    }
}