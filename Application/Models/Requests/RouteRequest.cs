namespace Application.Models.Requests
{
    public class RouteRequest
    {
        public Coordinate From { get; set; }
        public Coordinate To { get; set; }
    }

    public class Coordinate
    {
        public double Lat { get; set; }
        public double Lng { get; set; }
    }

}
