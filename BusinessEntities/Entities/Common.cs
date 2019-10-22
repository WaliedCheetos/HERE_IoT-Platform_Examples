using System;
using System.Collections.Generic;
using System.Text;

namespace BusinessEntities.Entities
{
    public class Common
    {
        /// <summary>
        /// Class that sends generic Response used by Inbound services
        /// </summary>
        public class GenericResponse
        {
            /// <summary>
            /// http request response code examples 200, 400
            /// </summary>
            public String ResponseCode { get; set; }
            
            ///// <summary>
            ///// bool decribes the status of the request
            ///// </summary>
            //public bool RequestAccepted { get; set; }            
            
            /// <summary>
            /// String that is sent the message by the inbound service that descibes the action taken
            /// </summary>
            public string ResponseMessage { get; set; }
            
            /// <summary>
            /// 
            /// </summary>
            public string ResponseData { get; set; }
        }
    }
}
