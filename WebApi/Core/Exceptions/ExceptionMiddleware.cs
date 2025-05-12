using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Text.Json;

namespace Core.Exceptions
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (HttpException httpEx)
            {
                _logger.LogWarning(httpEx, "HTTP помилка: {Status}", httpEx.Status);
                await HandleHttpExceptionAsync(context, httpEx);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Невідома помилка");
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleHttpExceptionAsync(HttpContext context, HttpException exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)exception.Status;

            var response = exception.Value ?? new
            {
                message = exception.Message,
                status = (int)exception.Status
            };

            var json = JsonSerializer.Serialize(response);
            return context.Response.WriteAsync(json);
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var response = new
            {
                message = "Внутрішня помилка сервера.",
                detail = exception.Message
            };

            var json = JsonSerializer.Serialize(response);
            return context.Response.WriteAsync(json);
        }
    }
}
