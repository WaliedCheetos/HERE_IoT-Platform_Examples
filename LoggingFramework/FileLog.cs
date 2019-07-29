using System;
using System.IO;
using System.Threading;
using System.Diagnostics;

namespace LoggingFramework
{
    /// <summary>
    /// This object provides method for writing to a text based file log.
    /// </summary>
    [Serializable()]
    public class FileLog : ILog
    {
        /// <summary>
        /// File to which messages (error and trace) will be written
        /// </summary>
        private string m_logFile;

        private bool m_trace = false;
        private bool m_debug = false;
        private bool m_lockFile = false;
        private bool m_info = false;

        private const string TIME_FORMAT = "dd/MM/yyyy|HH:mm:ss.ff|";  //ff for milli seconds, CAPS HH for 24 hrs.

        public FileLog()
        {
            m_logFile = Path.GetTempPath() + "\\RMEAppLog.txt";
        }

        public FileLog(string logFile, bool trace, bool debug)
        {
            if (logFile != null && logFile.Length > 0)
            {
                m_logFile = logFile;
            }
            else
            {
                m_logFile = Path.GetTempPath() + "\\RMEAppLog.txt";
            }

            m_trace = trace;
            m_debug = debug;           
        }

        public FileLog(string logFile, bool trace, bool debug, bool lockFile)
            : this (logFile, trace, debug)
        {
            m_lockFile = lockFile;
        }

        public string LogFile
        {
            get { return m_logFile; }
            set 
            {
                if (value != null && value.Length > 0)
                {
                    m_logFile = value;
                }
                else
                {
                    m_logFile = Path.GetTempPath() + "\\RMEAppLog.txt";
                }
            }
        }

        /// <summary>
        /// Storage location of this class can be set by this method
        /// It expects a single string parameter which is path to log file
        /// </summary>
        /// <param name="storageLocationInfo">path to log file</param>
        public void SetLogLocation(params object[] storageLocationInfo)
        {
            if (storageLocationInfo != null && storageLocationInfo.Length > 0)
            {
                LogFile = storageLocationInfo[0] as string;
            }
        }

        public string LogLocation
        {
            get { return m_logFile; }
        }

        public bool LockLogger
        {
            set { m_lockFile = value; }
        }

        #region ILog Members
        public bool Trace
        {
            get
            {
                return m_trace;
            }

            set
            {
                m_trace = value;              
            }
        }

        public bool Debug
        {
            get
            {
                return m_debug;
            }

            set
            {
                m_debug = value;                
            }
        }


        /// <summary>
        /// Writes an error message to the associated log file.
        /// </summary>
        /// <param name="message">Message to be written</param>
        public void WriteError(string message)
        {
            WriteError("{0}", message);
        }


        public virtual void WriteError(string format, params object[] messages)
        {
            StreamWriter writer = null;
            try
            {
                if (m_lockFile)
                {
                    lock (this)
                    {
                        writer = File.AppendText(m_logFile);
                        writer.Write("ERROR - {0}", DateTime.Now.ToString(TIME_FORMAT));
                        writer.WriteLine(format, messages);
                        
                        writer.Flush();                        
                    }
                }
                else
                {
                    writer = File.AppendText(m_logFile);
                    writer.Write("ERROR - {0}", DateTime.Now.ToString(TIME_FORMAT));
                    writer.WriteLine(format, messages);                    
                    writer.Flush();                 
                }
            }
            catch (Exception ex)
            {
            }
            finally
            {
                if (writer != null)
                {
                    writer.Close();
                }
            }
        }

        /// <summary>
        /// Writes trace messages to the associated log file,depending on the severity of the message.
        /// If the severity exceeds the allowed severity level, the message is not written.
        /// This controls the writing of trace messages to the log file so that these messages are written
        /// only when required by increasing the Potential severity level
        /// </summary>
        /// <param name="message"></param>
        public void WriteTrace(string message)
        {            
            if (m_trace)
            {
                Write("{0}", message);
            }

        }

        public void WriteTrace(string format, params object[] messages)
        {
            if (m_trace)
            {
                Write(format, messages);
            }
        }

        public void WriteDebug(string message)
        {
            if (m_debug)
            {
                Write("{0}", message);
            }
        }

        public void WriteDebug(string format, params object[] messages)
        {
            if (m_debug)
            {
                Write(format, messages);
            }
        }

        public void WriteInfo(string message)
        {
            if (m_info && message != null)
            {
                Write("{0}", message);
            }
        }

        public void WriteInfo(string format, params object[] messages)
        {
            if (m_info)
            {
                Write(format, messages);
            }
        }

        #endregion

        protected virtual void Write(string format, params object[] messages)
        {            
            if (m_lockFile)
            {
                lock (this)
                {
                    StreamWriter writer = null;
                    try
                    {
                        writer = File.AppendText(m_logFile);
                        writer.Write(DateTime.Now.ToString(TIME_FORMAT));
                        writer.WriteLine(format, messages);                       
                        writer.Flush();                        
                    }
                    catch (Exception ex)
                    {}
                    finally
                    {
                        if (writer != null)
                        {
                            writer.Close();
                        }  
                    }

                }
            }
            else
            {
                StreamWriter writer = null;
                try
                {
                    writer = File.AppendText(m_logFile);
                    writer.Write(DateTime.Now.ToString(TIME_FORMAT)); 
                    writer.WriteLine(format, messages);                    
                    writer.Flush();                    
                }
                catch (Exception ex)
                { }
                finally
                {
                    if (writer != null)
                    {
                        writer.Close();
                    }
                }
            }
        }

        public void Dispose()
        { }

        
        public bool Info 
        {
            get { return m_info; }
            set { m_info = value; }
        }
    }
}