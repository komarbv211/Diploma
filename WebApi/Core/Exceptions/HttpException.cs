using System.Net;

namespace Core.Exceptions
{
    [Serializable]
    public class HttpException : Exception
    {
        public HttpStatusCode Status { get; set; }
        public object? Value { get; }

        public HttpException(HttpStatusCode status, object? value = null)
        {
            Status = status;
            Value = value;
        }

        public HttpException(string? message, HttpStatusCode status) : base(message)
        {
            Status = status;
        }

        public HttpException(string? message, HttpStatusCode status, Exception? innerException, object? value = null) : base(message, innerException)
        {
            Status = status;
            Value = value;
        }
    }
}
