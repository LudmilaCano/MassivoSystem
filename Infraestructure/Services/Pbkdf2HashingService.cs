using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;
using MassivoProject.Application.Interfaces;
using Microsoft.Build.Tasks;

namespace MassivoProject.Infrastructure.Services
{
    public class Pbkdf2HashingService : IHashingService
    {
        // Parámetros de seguridad (puedes ajustarlos según políticas)
        private const int SaltSize = 16;        // 128 bits
        private const int KeySize = 32;        // 256 bits
        private const int Iterations = 100_000;   // número de rondas

        public (string Hash, string Salt) CreateHash(string plainText, string Salt, string Hash)
        {
            // 1) Generar salt aleatorio
            using var rng = RandomNumberGenerator.Create();
            var saltBytes = new byte[SaltSize];
            rng.GetBytes(saltBytes);

            // 2) Derivar key con PBKDF2 (Rfc2898 + SHA256)
            using var deriveBytes = new Rfc2898DeriveBytes(plainText, saltBytes, Iterations, HashAlgorithmName.SHA256);
            var keyBytes = deriveBytes.GetBytes(KeySize);

            // 3) Devolver en Base64
            return (
                Hash = Convert.ToBase64String(keyBytes),
                Salt = Convert.ToBase64String(saltBytes)
            );
        }

        public bool VerifyHash(string plainText, string hash, string salt)
        {
            // 1) Decodificar salt
            var saltBytes = Convert.FromBase64String(salt);

            // 2) Derivar key del plainText con ese salt
            using var deriveBytes = new Rfc2898DeriveBytes(plainText, saltBytes, Iterations, HashAlgorithmName.SHA256);
            var keyBytes = deriveBytes.GetBytes(KeySize);

            // 3) Comparar de forma segura
            var hashBytes = Convert.FromBase64String(hash);
            return CryptographicOperations.FixedTimeEquals(keyBytes, hashBytes);
        }
    }
}
