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

        //public class ToSpeedDataByLinkIds
        //{
        //    public List<string> LinkIds { get; set; }
        //}
        public class ToSpeedDataByLinkIds
        {
            public string LinkIds { get; set; }
        }

        public class CongestionFactorByLinkIds
        {
            public string LinkIds { get; set; }
            public string TimePattern { get; set; }
            public string Direction { get; set; }

        }

        public class CongestionFactorsByLinkIds
        {
            public string LinkIds { get; set; }
            public string TimePattern { get; set; }

        }
    }
}
