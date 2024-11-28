using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Bikes.Domain
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum FuelType { Petrol, Hybrid, Diesel, LPG }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum BodyType { Hatchback, Sedan, Kombi, SUV, Roadster }

    public class Bike
    {
        public Guid Id { get; set; }
        public string Brand { get; set; }
        public string Model { get; set; }
        public int DoorsNumber { get; set; }
        public int LuggageCapacity { get; set; }
        public int EngineCapacity { get; set; }
        public FuelType FuelType { get; set; }
        public DateTime ProductionDate { get; set; }
        public double BikeFuelConsumption { get; set; }
        public BodyType BodyType { get; set; }
    }
}