using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using Microsoft.AspNetCore.Mvc.Rendering;
using System.Web.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
//using System.Web.Script.Serialization;

namespace WebService.Controllers.Admin
{
    //[ApiController]
    [Microsoft.AspNetCore.Mvc.Route("api/[controller]/[action]")]
    public class AdminWebServiceController : ApiController
    {
        public class RequestParams
        {
            public string User { get; set; }

            public string Token { get; set; }

            public string Method { get; set; }

            public object Data { get; set; }

        }

        private bool ValidateRequestUser(string Username, string Token, string RemoteServerIP)
        {
            bool isRequestUserValid = false;
            try
            {
                //valid token, valid remoteServerIP is part of whitelisted IPs, etc.
                //for future use, if required. 
                isRequestUserValid = true;
            }
            catch (Exception exception)
            {

                throw;
            }
            finally
            { }
            return isRequestUserValid;
        }
        private BusinessEntities.Entities.Common.GenericResponse GetToSpeedDataByLinkId(BusinessEntities.Entities.HERE_TrafficAnalyticsRequests.ToSpeedDataByLinkIds toSpeedDataByLinkIds)
        {
            ///log message
            ///
            Startup._iLog.WriteDebug("============================================= GetToSpeedDataByLinkId =============================================");
            //Startup._iLog.WriteDebug(string.Format("To Speed Data LinkIds: {0}", string.Join(",", toSpeedDataByLinkIds.LinkIds.ToArray())));
            Startup._iLog.WriteDebug(string.Format("To Speed Data LinkIds: {0}", toSpeedDataByLinkIds.LinkIds));

            BusinessEntities.Entities.Common.GenericResponse genericResponse = null;
            try
            {
                //if (toSpeedDataByLinkIds == null || toSpeedDataByLinkIds.LinkIds.Count == 0)
                if (toSpeedDataByLinkIds == null || string.IsNullOrEmpty(toSpeedDataByLinkIds.LinkIds))
                {
                    genericResponse = new BusinessEntities.Entities.Common.GenericResponse()
                    {
                        ResponseCode = ((int)HttpStatusCode.OK).ToString(),
                        ResponseMessage = ("all request parameters are required."),
                        ResponseData = string.Empty
                    };
                }
                else
                {
                    genericResponse = new BusinessEntities.Entities.Common.GenericResponse()
                    {
                        ResponseCode = ((int)HttpStatusCode.OK).ToString(),
                        ResponseMessage = ("WaliedCheetos : Hollla"),
                        ResponseData = BusinessLogic.Operations.HERE_TrafficAnalytics._fx_GetToSpeedDataByLinkIds(toSpeedDataByLinkIds, Startup._iLog, string.Empty)
                    };
                }
            }
            catch (Exception exception)
            {
                ///log message
                ///
                Startup._iLog.WriteError(string.Format("Exception: {0}", exception.ToString()));

                genericResponse = new BusinessEntities.Entities.Common.GenericResponse()
                {
                    ResponseCode = ((int)HttpStatusCode.InternalServerError).ToString(),
                    ResponseMessage = (exception.ToString()),
                    ResponseData = string.Empty
                };
            }
            finally
            {

            }
            return genericResponse;
        }
        private BusinessEntities.Entities.Common.GenericResponse GetCongestionFactorByLinkIds(BusinessEntities.Entities.HERE_TrafficAnalyticsRequests.CongestionFactorByLinkIds congestionFactorByLinkIds)
        {
            ///log message
            ///
            Startup._iLog.WriteDebug("============================================= GetCongestionFactorByLinkIds =============================================");
            //Startup._iLog.WriteDebug(string.Format("To Speed Data LinkIds: {0}", string.Join(",", toSpeedDataByLinkIds.LinkIds.ToArray())));
            //Startup._iLog.WriteDebug(string.Format("Congestion Factor Params : {0}", Newtonsoft.Json.JsonConvert.SerializeObject(congestionFactorByLinkIds)));

            BusinessEntities.Entities.Common.GenericResponse genericResponse = null;
            try
            {
                if (
                    congestionFactorByLinkIds == null 
                    || 
                    string.IsNullOrEmpty(congestionFactorByLinkIds.LinkIds) 
                    || 
                    string.IsNullOrEmpty(congestionFactorByLinkIds.TimePattern) 
                    || 
                    string.IsNullOrEmpty(congestionFactorByLinkIds.Direction)
                    )
                {
                    genericResponse = new BusinessEntities.Entities.Common.GenericResponse()
                    {
                        ResponseCode = ((int)HttpStatusCode.OK).ToString(),
                        ResponseMessage = ("all request parameters are required."),
                        ResponseData = string.Empty
                    };
                }
                else
                {
                    genericResponse = new BusinessEntities.Entities.Common.GenericResponse()
                    {
                        ResponseCode = ((int)HttpStatusCode.OK).ToString(),
                        ResponseMessage = ("WaliedCheetos : Hollla"),
                        ResponseData = BusinessLogic.Operations.HERE_TrafficAnalytics._fx_GetCongestionFactorByLinkIds(congestionFactorByLinkIds, Startup._iLog, string.Empty)
                    };
                }
            }
            catch (Exception exception)
            {
                ///log message
                ///
                Startup._iLog.WriteError(string.Format("Exception: {0}", exception.ToString()));

                genericResponse = new BusinessEntities.Entities.Common.GenericResponse()
                {
                    ResponseCode = ((int)HttpStatusCode.InternalServerError).ToString(),
                    ResponseMessage = (exception.ToString()),
                    ResponseData = string.Empty
                };
            }
            finally
            {

            }
            return genericResponse;
        }

        private BusinessEntities.Entities.Common.GenericResponse GetCongestionFactorsByLinkIds(BusinessEntities.Entities.HERE_TrafficAnalyticsRequests.CongestionFactorsByLinkIds congestionFactorsByLinkIds)
        {
            ///log message
            ///
            Startup._iLog.WriteDebug("============================================= GetCongestionFactorsByLinkIds =============================================");
            //Startup._iLog.WriteDebug(string.Format("To Speed Data LinkIds: {0}", string.Join(",", toSpeedDataByLinkIds.LinkIds.ToArray())));
            //Startup._iLog.WriteDebug(string.Format("Congestion Factor Params : {0}", Newtonsoft.Json.JsonConvert.SerializeObject(congestionFactorsByLinkIds)));

            BusinessEntities.Entities.Common.GenericResponse genericResponse = null;
            try
            {
                if (
                    congestionFactorsByLinkIds == null 
                    || 
                    string.IsNullOrEmpty(congestionFactorsByLinkIds.LinkIds) 
                    || 
                    string.IsNullOrEmpty(congestionFactorsByLinkIds.TimePattern) 
                    )
                {
                    genericResponse = new BusinessEntities.Entities.Common.GenericResponse()
                    {
                        ResponseCode = ((int)HttpStatusCode.OK).ToString(),
                        ResponseMessage = ("all request parameters are required."),
                        ResponseData = string.Empty
                    };
                }
                else
                {
                    genericResponse = new BusinessEntities.Entities.Common.GenericResponse()
                    {
                        ResponseCode = ((int)HttpStatusCode.OK).ToString(),
                        ResponseMessage = ("WaliedCheetos : Hollla"),
                        ResponseData = BusinessLogic.Operations.HERE_TrafficAnalytics._fx_GetCongestionFactorsByLinkIds(congestionFactorsByLinkIds, Startup._iLog, string.Empty)
                    };
                }
            }
            catch (Exception exception)
            {
                ///log message
                ///
                Startup._iLog.WriteError(string.Format("Exception: {0}", exception.ToString()));

                genericResponse = new BusinessEntities.Entities.Common.GenericResponse()
                {
                    ResponseCode = ((int)HttpStatusCode.InternalServerError).ToString(),
                    ResponseMessage = (exception.ToString()),
                    ResponseData = string.Empty
                };
            }
            finally
            {

            }
            return genericResponse;
        }


        //[Microsoft.AspNetCore.Mvc.Route("api/WCheetosWebService/GenericJSONRequest")]
        [System.Web.Http.HttpPost]
        public BusinessEntities.Entities.Common.GenericResponse GenericJSONRequest([Microsoft.AspNetCore.Mvc.FromBody] Newtonsoft.Json.Linq.JToken GenericJSONRequest)
        {
            //HttpResponseMessage httpResponseMessage = null;
            BusinessEntities.Entities.Common.GenericResponse genericResponse = null;
            string methodName = string.Empty;

            ///log message
            ///
            Startup._iLog.WriteDebug("============================================= GenericJSONRequest =============================================");
   
            try
            {
                if (GenericJSONRequest != null)
                { 
                    ///log message
                    ///
                    //N.B. memory intentsive operation.
                    Startup._iLog.WriteDebug(string.Format("Request: {0}", GenericJSONRequest.ToString()));

                    RequestParams requestParams = Newtonsoft.Json.JsonConvert.DeserializeObject<RequestParams>(GenericJSONRequest.ToString());
                    genericResponse = this.InBoundRequest(requestParams);
                }
                else
                {
                    ///log message
                    ///
                    Startup._iLog.WriteError(string.Format("Error: {0}", "GenericJSONRequest: Null value passed in parameter _jToken_GenericJSONRequest. No action taken."));
                }
            }
            catch (Exception exception)
            {
                ///log message
                ///
                Startup._iLog.WriteError(string.Format("Exception: {0}", exception.ToString()));

                genericResponse = new BusinessEntities.Entities.Common.GenericResponse()
                {
                    ResponseCode = ((int)HttpStatusCode.InternalServerError).ToString(),
                    ResponseMessage = (exception.ToString()),
                    ResponseData = string.Empty
                };
            }
            finally
            {
                ///log message
                ///
                //N.B. memory intentsive operation.
                Startup._iLog.WriteDebug(string.Format("Response: {0}", (Newtonsoft.Json.JsonConvert.SerializeObject(genericResponse))));
            }
            return genericResponse;
        }

        //[Microsoft.AspNetCore.Mvc.Route("api/WCheetosWebService/InBoundRequest")]
        [System.Web.Http.HttpPost]
        public BusinessEntities.Entities.Common.GenericResponse InBoundRequest(RequestParams requestParams)
        {
            BusinessEntities.Entities.Common.GenericResponse genericResponse = null;
            try
            {
                if (requestParams != null && !string.IsNullOrEmpty(requestParams.Method))
                {
                    if (ValidateRequestUser(requestParams.User, requestParams.Token, string.Empty))
                    {
                        //JavaScriptSerializer javaScriptSerializer = new JavaScriptSerializer();

                        switch (requestParams.Method.ToUpper())
                        {
                            case "GETTOSPEEDDATABYLINKID":

                                BusinessEntities.Entities.HERE_TrafficAnalyticsRequests.ToSpeedDataByLinkIds toSpeedDataByLinkIds =  Newtonsoft.Json.JsonConvert.DeserializeObject<BusinessEntities.Entities.HERE_TrafficAnalyticsRequests.ToSpeedDataByLinkIds>(requestParams.Data.ToString());
                                genericResponse = this.GetToSpeedDataByLinkId(toSpeedDataByLinkIds);
                                break;
                            case "GETCONGESTIONFACTORBYLINKIDS":

                                BusinessEntities.Entities.HERE_TrafficAnalyticsRequests.CongestionFactorByLinkIds congestionFactorByLinkIds =  Newtonsoft.Json.JsonConvert.DeserializeObject<BusinessEntities.Entities.HERE_TrafficAnalyticsRequests.CongestionFactorByLinkIds>(requestParams.Data.ToString());
                                genericResponse = this.GetCongestionFactorByLinkIds(congestionFactorByLinkIds);
                                break;
                            case "GETCONGESTIONFACTORSBYLINKIDS":

                                BusinessEntities.Entities.HERE_TrafficAnalyticsRequests.CongestionFactorsByLinkIds congestionFactorsByLinkIds =  Newtonsoft.Json.JsonConvert.DeserializeObject<BusinessEntities.Entities.HERE_TrafficAnalyticsRequests.CongestionFactorsByLinkIds>(requestParams.Data.ToString());
                                genericResponse = this.GetCongestionFactorsByLinkIds(congestionFactorsByLinkIds);
                                break;
                            default:
                                genericResponse = new BusinessEntities.Entities.Common.GenericResponse()
                                {
                                    ResponseCode = ((int)HttpStatusCode.NotImplemented).ToString(),
                                    ResponseMessage = ("Method is not implemented"),
                                    ResponseData = string.Empty
                                };
                                break;
                        }
                    }
                    else
                    {
                        genericResponse = new BusinessEntities.Entities.Common.GenericResponse()
                        {
                            ResponseCode = ((int)HttpStatusCode.Unauthorized).ToString(),
                            ResponseMessage = ("Unauthorized access"),
                            ResponseData = string.Empty
                        };
                    }
                }
            }
            catch (Exception exception)
            {
                ///log message
                ///
                Startup._iLog.WriteError(string.Format("Exception: {0}", exception.ToString()));

                genericResponse = new BusinessEntities.Entities.Common.GenericResponse()
                {
                    ResponseCode = ((int)HttpStatusCode.InternalServerError).ToString(),
                    ResponseMessage = (exception.ToString()),
                    ResponseData = string.Empty
                };
            }
            finally { }

            return genericResponse;
        }
    }
}