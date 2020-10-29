using System;

namespace Application.Search.Inputs
{
  public class ActivityInput
  {
    public Guid Id { get; set; }
    public Guid UserHostId { get; set; }
    public Guid UserVisitorId { get; set; }
    public string UserInput { get; set; }
    public bool IsVisited { get; set; }
  }
}