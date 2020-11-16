using System;
using Microsoft.AspNetCore.Http;

namespace Application
{
    public class FileModel
    {
        public Guid UserId { get; set; }
        public string FileName { get; set; }
        public string FileExtension { get; set; }
        public IFormFile FormFile { get; set; }
    }
}