using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Users
{
  public class IsSubscribed
  {
    public class Query : IRequest<bool>
    {
      public string Email { get; set; }
    }

    public class Handler : IRequestHandler<Query, bool>
    {
      private readonly DataContext _context;
      public Handler(DataContext context)
      {
        _context = context;
      }

      public async Task<bool> Handle(Query request, CancellationToken cancellationToken)
      {
        return await _context.SubscriberOnEmailNews.FirstOrDefaultAsync(s => s.Email == request.Email) != null;
      }
    }
  }
}