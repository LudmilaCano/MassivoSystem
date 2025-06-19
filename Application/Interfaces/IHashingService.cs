using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MassivoProject.Application.Interfaces
{
    /// <summary>
    /// Servicio para generar y verificar hashes.
    /// </summary>
    public interface IHashingService
    {
        /// <summary>
        /// Genera un hash + salt a partir de un texto plano.
        /// </summary>
        /// <param name="plainText">Texto claro a hashear.</param>
        /// <returns>Tuple(HashBase64, SaltBase64)</returns>
        (string Hash, string Salt) CreateHash(string plainText, string Salt, string Hash);

        /// <summary>
        /// Verificar que el texto plano, al hashearse con el mismo salt, coincida con el hash.
        /// </summary>
        /// <param name="plainText">Texto claro a verificar.</param>
        /// <param name="hash">Hash almacenado (Base64).</param>
        /// <param name="salt">Salt almacenado (Base64).</param>
        bool VerifyHash(string plainText, string hash, string salt);
    }
}