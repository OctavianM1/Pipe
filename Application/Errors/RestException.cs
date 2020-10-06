using System;
using System.Net;

namespace Application.Errors
{
  public class RestException : Exception
  {
    public RestException(HttpStatusCode code, object errors = null)
    {
        Code = code;
        Errors = errors;
    }

    public RestException(string code, object errors = null)
    {
        ErrorName = code;
        Errors = errors;
    }

    public string ErrorName { get; set; }
    public HttpStatusCode Code { get; }
    public object Errors { get; }
  }
}