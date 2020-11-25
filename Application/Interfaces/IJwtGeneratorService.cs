using Domain;

namespace Application.Interfaces
{
  public interface IJwtGeneratorService
  {
    string CreateToken(User user);
  }
}