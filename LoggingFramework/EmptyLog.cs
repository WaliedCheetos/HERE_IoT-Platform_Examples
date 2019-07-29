using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoggingFramework
{
    public class EmptyLog : ILog
    {
        
        public bool Trace { get; set; }

        public bool Debug { get; set; }

       
        public bool Info { get; set; }

       
        public void WriteError(string message)
        {
          
        }

       
        public void WriteError(string format, params object[] messages)
        {
            
        }

      
        public void WriteTrace(string message)
        {
           
        }

      
        public void WriteTrace(string format, params object[] messages)
        {
           
        }

       
        public void WriteDebug(string message)
        {
        }

      
        public void WriteDebug(string format, params object[] messages)
        {
        }

       
        public void WriteInfo(string message)
        {
            
        }

      
        public void WriteInfo(string format, params object[] messages)
        {
            
        }

        public bool LockLogger
        {
            set
            {
                // Do nothing
            }
        }

    
        public void SetLogLocation(params object[] storageLocationInfo)
        {
            
        }

       
        public string LogLocation
        {
            get { return "Empty Trace"; }
        }

        public void Dispose()
        {
        }
    }
}
