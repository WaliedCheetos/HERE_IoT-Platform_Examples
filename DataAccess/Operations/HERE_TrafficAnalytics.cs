using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Text;

namespace DataAccess.Operations
{
    public class HERE_TrafficAnalytics
    {
        public string _fx_GetTrafficAnalyticsByDates(BusinessEntities.Entities.HERE_TrafficAnalyticsRequests.TrafficAnalyticsByDates trafficAnalyticsByDates, LoggingFramework.ILog iLog, string Usertag)
        {
            string Result = string.Empty;
            try
            {
                using (SqlConnection sqlConnection = DataAccess.Admin.DataAccessManager._fx_GetSqlConnection(iLog, string.Empty))
                {
                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter("_spt_GetTrafficAnalyticsByDates", sqlConnection);
                    sqlDataAdapter.SelectCommand.CommandType = System.Data.CommandType.StoredProcedure;
                    sqlDataAdapter.SelectCommand.Parameters.AddWithValue("@_param_TAFromDate", trafficAnalyticsByDates.FromDate);
                    sqlDataAdapter.SelectCommand.Parameters.AddWithValue("@_param_TAToDate", trafficAnalyticsByDates.ToDate);

                    using (DataTable dataTable = new DataTable())
                    {
                        sqlDataAdapter.Fill(dataTable);
                        if (dataTable.Rows.Count > 0)
                            Result = Newtonsoft.Json.JsonConvert.SerializeObject(dataTable);
                    }
                }
            }
            catch (Exception exception)
            {
                iLog.WriteError(exception.ToString());
            }
            finally
            { }
            return Result;
        }

        public static string _fx_GetToSpeedDataByLinkIds(BusinessEntities.Entities.HERE_TrafficAnalyticsRequests.ToSpeedDataByLinkIds toSpeedDataByLinkIds, LoggingFramework.ILog iLog, string Usertag)
        {
            string Result = string.Empty;
            try
            {
                using (SqlConnection sqlConnection = DataAccess.Admin.DataAccessManager._fx_GetSqlConnection(iLog, string.Empty))
                {
                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter("_spt_GetToSpeedDataByLinkIds", sqlConnection);
                    sqlDataAdapter.SelectCommand.CommandType = System.Data.CommandType.StoredProcedure;
                    
                    sqlDataAdapter.SelectCommand.Parameters.AddWithValue("@_param_LINKIDs", toSpeedDataByLinkIds.LinkIds);

                    using (DataTable dataTable = new DataTable())
                    {
                        sqlDataAdapter.Fill(dataTable);
                        if (dataTable.Rows.Count > 0)
                            Result = Newtonsoft.Json.JsonConvert.SerializeObject(dataTable);
                    }
                }
            }
            catch (Exception exception)
            {
                Result = exception.ToString();
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
                using (SqlConnection sqlConnection = DataAccess.Admin.DataAccessManager._fx_GetSqlConnection(iLog, string.Empty))
                {
                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter("_spt_GetCongestionFactorByLinkIds", sqlConnection);
                    sqlDataAdapter.SelectCommand.CommandType = System.Data.CommandType.StoredProcedure;

                    sqlDataAdapter.SelectCommand.Parameters.AddWithValue("@_param_LinkIds", congestionFactorByLinkIds.LinkIds);
                    sqlDataAdapter.SelectCommand.Parameters.AddWithValue("@_param_TimePattern", congestionFactorByLinkIds.TimePattern);
                    sqlDataAdapter.SelectCommand.Parameters.AddWithValue("@_param_Direction", congestionFactorByLinkIds.Direction);

                    using (DataTable dataTable = new DataTable())
                    {
                        sqlDataAdapter.Fill(dataTable);
                        if (dataTable.Rows.Count > 0)
                            Result = Newtonsoft.Json.JsonConvert.SerializeObject(dataTable);
                    }
                }
            }
            catch (Exception exception)
            {
                Result = exception.ToString();
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
                using (SqlConnection sqlConnection = DataAccess.Admin.DataAccessManager._fx_GetSqlConnection(iLog, string.Empty))
                {
                    SqlDataAdapter sqlDataAdapter = new SqlDataAdapter("_spt_GetCongestionFactorsByLinkIds", sqlConnection);
                    sqlDataAdapter.SelectCommand.CommandType = System.Data.CommandType.StoredProcedure;

                    sqlDataAdapter.SelectCommand.Parameters.AddWithValue("@_param_LinkIds", congestionFactorsByLinkIds.LinkIds);
                    sqlDataAdapter.SelectCommand.Parameters.AddWithValue("@_param_TimePattern", congestionFactorsByLinkIds.TimePattern);

                    using (DataTable dataTable = new DataTable())
                    {
                        sqlDataAdapter.Fill(dataTable);
                        if (dataTable.Rows.Count > 0)
                            Result = Newtonsoft.Json.JsonConvert.SerializeObject(dataTable);
                    }
                }
            }
            catch (Exception exception)
            {
                Result = exception.ToString();
                iLog.WriteError(exception.ToString());
                
            }
            finally
            { }
            return Result;
        }
    }
}
