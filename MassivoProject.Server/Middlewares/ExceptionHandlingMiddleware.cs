using Microsoft.Data.Sqlite;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;

namespace MassivoProject.Server.Middlewares
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var (statusCode, message) = GetStatusCodeAndMessage(exception);

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;

            var result = JsonSerializer.Serialize(new { error = message });
            await context.Response.WriteAsync(result);
        }

        private (int StatusCode, string Message) GetStatusCodeAndMessage(Exception exception)
        {
            return exception switch
            {
                SqliteException sqlEx => (500, "Error en la base de datos: " + sqlEx.Message),
                JsonException jsonEx => (400, "Error al procesar los datos JSON: " + jsonEx.Message),
                ArgumentNullException argNullEx => (400, "Argumento nulo: " + argNullEx.Message),
                ArgumentOutOfRangeException argOutOfRangeEx => (400, "Argumento fuera de rango: " + argOutOfRangeEx.Message),
                InvalidOperationException invalidOpEx => (409, "Operación no válida: " + invalidOpEx.Message),
                UnauthorizedAccessException unauthorizedEx => (401, "Acceso denegado: " + unauthorizedEx.Message),
                FileNotFoundException fileNotFoundEx => (404, "Archivo no encontrado: " + fileNotFoundEx.Message),
                IOException ioEx => (500, "Error de entrada/salida: " + ioEx.Message),
                NullReferenceException nullRefEx => (500, "Referencia nula: " + nullRefEx.Message),
                TimeoutException timeoutEx => (408, "Tiempo de espera agotado: " + timeoutEx.Message),
                KeyNotFoundException keyNotFoundEx => (404, "Elemento no encontrado: " + keyNotFoundEx.Message),
                NotImplementedException notImplEx => (501, "Funcionalidad no implementada: " + notImplEx.Message),
                ValidationException validationEx => (400, "Error de validación: " + validationEx.Message),
                _ => (500, "Error inesperado: " + exception.Message),
            };
        }
    }
}
