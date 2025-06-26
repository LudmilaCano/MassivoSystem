using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Enums
{
    public enum NotificationType
    {
        RegistroUsuario,
        VehiculoCreado,
        EventoCreado,
        ReservaCreadaPrestador,
        ReservaCancelPrestador,
        ReservaCreadaUser,
        ReservaCancelUser,
        ReservaProxima,
        PagoConfirmado,
        NuevaResena,
        PasswordChanged,
        CambioRol
    }
}
