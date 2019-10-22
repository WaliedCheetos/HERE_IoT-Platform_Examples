using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessLogic.Operations
{
    public class HERE_TrafficAnalytics
    {
        public static string _fx_GetToSpeedDataByLinkIds(BusinessEntities.Entities.HERE_TrafficAnalyticsRequests.ToSpeedDataByLinkIds toSpeedDataByLinkIds, LoggingFramework.ILog iLog, string Usertag)
        {
            string Result = string.Empty;
            try
            {
                Result = DataAccess.Operations.HERE_TrafficAnalytics._fx_GetToSpeedDataByLinkIds(toSpeedDataByLinkIds, iLog, Usertag);
            }
            catch (Exception exception)
            {
                iLog.WriteError(exception.ToString());
            }
            finally
            { }
            return Result;
        }

        public static string _fx_GetCongestionFactorByLinkIds(BusinessEntities.Entities.HERE_TrafficAnalyticsRequests.CongestionFactorByLinkIds congestionFactorByLinkIds, LoggingFramework.ILog iLog, string Usertag)
        {
            string Result = string.Empty;
            try
            {
                Result = DataAccess.Operations.HERE_TrafficAnalytics._fx_GetCongestionFactorByLinkIds(congestionFactorByLinkIds, iLog, Usertag);
            }
            catch (Exception exception)
            {
                iLog.WriteError(exception.ToString());
            }
            finally
            { }
            return Result;
        }

        public static string _fx_GetCongestionFactorsByLinkIds(BusinessEntities.Entities.HERE_TrafficAnalyticsRequests.CongestionFactorsByLinkIds congestionFactorsByLinkIds, LoggingFramework.ILog iLog, string Usertag)
        {
            string Result = string.Empty;
            try
            {
                Result = DataAccess.Operations.HERE_TrafficAnalytics._fx_GetCongestionFactorsByLinkIds(congestionFactorsByLinkIds, iLog, Usertag);
            }
            catch (Exception exception)
            {
                iLog.WriteError(exception.ToString());
            }
            finally
            { }
            return Result;
        }
    }
}
