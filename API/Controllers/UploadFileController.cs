using System.IO;
using System.Threading.Tasks;
using Application;
using Application.Errors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class UploadFileController : ControllerBase
  {
    private readonly DataContext _context;
    public UploadFileController(DataContext context)
    {
      _context = context;
    }

    [HttpPost("userCoverImage"), DisableRequestSizeLimit]
    public async Task<ActionResult> UploadFile([FromForm] FileModel file)
    {
      string path = Path.Combine(Directory.GetCurrentDirectory(), "../client-side/public/images/userPhotos", file.FileName);

      using (Stream stream = new FileStream(path, FileMode.Create))
      {
        await file.FormFile.CopyToAsync(stream);
      }

      var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == file.UserId);
      if (user == null)
      {
        throw new RestException(System.Net.HttpStatusCode.NotFound, new { user = "User wasn't found!" });
      }

      if (user.CoverImageExtension != file.FileExtension)
      {
        user.CoverImageExtension = file.FileExtension;
        await _context.SaveChangesAsync();
      }
      
      return StatusCode(StatusCodes.Status200OK);
    }
  }
}