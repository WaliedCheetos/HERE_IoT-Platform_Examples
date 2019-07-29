using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessEntities.Entities
{
    public class HERE_TrafficAnalyticsRequests
    {
        public class TrafficAnalyticsByDates
        {
            public DateTime FromDate { get; set; }
            public DateTime ToDate { get; set; }
        }
    }
}
