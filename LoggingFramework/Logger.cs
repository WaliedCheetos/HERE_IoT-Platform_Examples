using System;
using System.Collections.Generic;
using System.Text;

namespace LoggingFramework
{
    // Sometimes developers forget to check that the logging component is available or not, when logging, and this may crash their applications if the component is not available.
    // At the other hand, most applications should be able to work even if the logging component is not available. 
    // So this class helps to achieve this objective (if it is needed) and it makes sure that the logging component is available in every call 
    // and if it is not, then the application will continue to work safely.
    // Even though a developer can achieve his objective without using the Logger class but this reusable module will help to reduce the code and also the potential "null reference" bugs.
    public class Logger
    {
        private ILog m_log;
        /// <summary>
        /// The developer should not use this property directly unless s/he needs an advanced future of the logging component.
        /// </summary>
        public ILog Log 
        { 
            get {return(m_log);} 

            set {m_log=value;}         
        }

        public Logger(ILog log)
        {
            m_log = log;
        }
        public void WriteTrace(string format, params object[] args)
        {
            if ( m_log != null &&  m_log.Trace)
            {
                m_log.WriteTrace(format, args);
            }

        }

        public void WriteError(string format, params object[] args)
        {
            if ( m_log != null)
            {
                m_log.WriteError(format, args);
            }

        }

        public void WriteDebug(string format, params object[] args)
        {
            if ( m_log != null &&  m_log.Debug)
            {
                m_log.WriteDebug(format, args);
            }

        }

        public void WriteInfo(string format, params object[] args)
        {
            if ( m_log != null &&  m_log.Info)
            {
                m_log.WriteInfo(format, args);
            }

        }

    }
}
