using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Models.Requests
{
    public class UpdateEventRequest
    {
        public int EventId { get; set; }
        public int UserId { get; set; }
        public string Location { get; set; }
        public string Name { get; set; }
        public DateTime EventDate { get; set; }
        public EventType Type { get; set; }
    }
}
