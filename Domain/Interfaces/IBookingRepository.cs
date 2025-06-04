using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IBookingRepository : IRepositoryBase<Booking>
    {
        Task<List<Booking>> GetBookingByUserIdAsync(int userId);
        Task<List<Booking>> GetBookingWithEventVehicleAsync();
        Task<Booking?> GetBookingWithEventVehicleByUserIdAsync(int userId);
        Task<Booking?> GetBookingWithEventVehicleIdAsync(int id);
    }
}
