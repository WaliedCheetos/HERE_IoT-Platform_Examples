#region Using directives

using System;
using System.Collections.Generic;
using System.Text;
using System.IO;
using System.Runtime.Serialization;

#endregion

namespace LoggingFramework
{
    [Serializable()]
    public class BufferedFileLog : ILog, IDisposable
    {
        private bool m_trace = false;
        private bool m_debug = false;
		
        [NonSerialized]
        private StreamWriter m_fileWriter;
        
        private string m_fileName;
        private bool m_info = false;
        private const string TIME_FORMAT = "dd/MM/yyyy|HH:mm:ss.ff|";  //ff for milli seconds, CAPS HH for 24 hrs.


        public BufferedFileLog()
        {  
        }

        public BufferedFileLog(string logFile, bool trace, bool debug)
        {
            m_trace = trace;
            m_debug = debug;

            CreateWriter(logFile);
        }

        /// <summary>
        /// Override Finalize to release the file handle.
        /// Finalize will not be called if Dispose() has been invoked
        /// </summary>
        ~BufferedFileLog()
        {
            DisposeWriter();
        }

		public bool LockLogger
		{
			set { ; }
		}

        public void Flush()
        {
            if (m_fileWriter != null)
            {
                m_fileWriter.Flush();
            }
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


        public void WriteError(string message)
        {
            WriteError("{0}", message);
        }

        public void WriteError(string format, params object[] messages)
        {
            if (m_fileWriter == null)
            {
                CreateWriter(m_fileName);
            }

            if (m_fileWriter != null)
            {
                lock (this)
                {
                    m_fileWriter.Write("ERROR - {0}", DateTime.Now.ToString(TIME_FORMAT));
                    m_fileWriter.WriteLine(format, messages);                    
                }
            }
        }

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


        #region IDisposable Members

        public void Dispose()
        {
            DisposeWriter();
            GC.SuppressFinalize(this);
        }

        #endregion

        private void DisposeWriter()
        {
            if (m_fileWriter != null)
            {
                try
                {
                    m_fileWriter.Flush();
                }
                catch (Exception ex)
                { }

                try
                {
                    m_fileWriter.Close();
                }
                catch (Exception ex)
                { }
            }

            m_fileWriter = null;
        }


        private void Write(string format, params object[] messages)
        {
            if (m_fileWriter == null)
            {
                CreateWriter(m_fileName);
            }

            if (m_fileWriter != null)
            {
                lock (this)
                {
                    try
                    {
                        m_fileWriter.Write(DateTime.Now.ToString(TIME_FORMAT));
                        m_fileWriter.WriteLine(format, messages);
                        m_fileWriter.WriteLine();
                    }
                    catch (Exception ex)
                    { }
                }
            }
        }

        public string LogFile
        {
            get 
            { 
                return m_fileName;
            }
            set 
            {   
                //dispose and flush current writer
                DisposeWriter();
                
                //create new one for this file                
                CreateWriter(value);
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
            get { return m_fileName; }
        }


        /// <summary>
        /// Tries to create a new FileWriter for given filename
        /// If it fails, creates one in temp path
        /// Membervariable, m_filewriter and m_filename are set by this method
        /// </summary>
        /// <param name="logFile"></param>
        /// <returns></returns>
        private void CreateWriter(string logFile)
        {
            if (string.IsNullOrEmpty(logFile))
            {
                logFile = Path.GetTempPath() + "\\" + GetTempFileName();                
            }

            try
            {
                m_fileWriter = new StreamWriter(logFile, true);
                m_fileName = logFile;
            }
            catch (Exception ex)
            {
                //Path is invalid. Create writer in user's temp path
                m_fileName = Path.GetTempPath() + "\\" + GetTempFileName();                
                m_fileWriter = new StreamWriter(m_fileName, true);                
            }
        }
        private string GetTempFileName()
        {
            return string.Format("RMEAppLog_{0}.txt", Guid.NewGuid().ToString());
        }
        /// <summary>
        /// Get or set info mode.
        /// </summary>
        public bool Info
        {
            get { return m_info; }
            set { m_info = value; }
        }


        [OnSerializing()]
        internal void BeforeSerialization(StreamingContext context)
        {  
            DisposeWriter();
        }

        [OnDeserialized()]
        internal void AfterDeserialization(StreamingContext context)
        {
            if (m_fileWriter == null)
            {
                CreateWriter(m_fileName);
            }
        }

    }

    
}


