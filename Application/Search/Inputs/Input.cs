using System;

namespace Application.Search.Inputs
{
  public class Input
  {
    public Guid Id { get; set; }
    public string UserInput { get; set; }
    public bool IsVisited { get; set; }
  }
}