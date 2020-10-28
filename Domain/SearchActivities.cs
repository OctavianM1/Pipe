using System;

namespace Domain
{
  public class SearchActivities
  {
    public Guid Id { get; set; }
    public Guid UserHostId { get; set; }
    public virtual User UserHost { get; set; }
    public Guid UserVisitorId { get; set; }
    public virtual User UserVisitor { get; set; }
    public string Input { get; set; }
  }
}