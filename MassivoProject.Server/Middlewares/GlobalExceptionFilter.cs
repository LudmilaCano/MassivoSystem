using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;

namespace MassivoProject.Server.Exceptions
{
    public class GlobalExceptionFilter : IExceptionFilter
    {
        public void OnException(ExceptionContext context)
        {
            var (statusCode, message) = GetStatusCodeAndMessage(context);

            var result = new ObjectResult(new { error = message })
            {
                StatusCode = statusCode
            };

            context.Result = result;
            context.ExceptionHandled = true;
        }

        private (int StatusCode, string Message) GetStatusCodeAndMessage(ExceptionContext context)
        {
            return context.Exception switch
            {
                DbUpdateException dbEx => (500, "Error en la base de datos: " + dbEx.Message),
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
                _ => (500, "Error inesperado: " + context.Exception.Message),
            };
        }
    }
}
