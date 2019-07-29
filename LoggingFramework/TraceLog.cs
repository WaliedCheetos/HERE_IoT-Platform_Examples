using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LoggingFramework
{
    /// <summary>
    /// Class that writes log messages using .NET Framework Trace class
    /// </summary>
    [Serializable]
    public class TraceLog : ILog
    {

        private string m_category;
        private const string TIME_FORMAT = "dd/MM/yyyy|HH:mm:ss.ff|";  //ff for milli seconds, CAPS HH for 24 hrs.

        /// <summary>Initializes a new instance of the <see cref="DotNetLog"/> class.
        /// </summary>
        public TraceLog()
            : this(false, false, true)
        {
        }

        /// <summary>Initializes a new instance of the <see cref="TraceLog"/> class.
        /// </summary>
        /// <param name="trace">if set to <c>true</c> [trace].</param>
        /// <param name="debug">if set to <c>true</c> [debug].</param>
        public TraceLog(bool trace, bool debug, bool showDateTime)
        {
            Trace = trace;
            Debug = debug;
            Info = true;
            ShowDateTime = showDateTime;
        }

        /// <summary>Gets or sets a value indicating whether date and time should be written to the log
        /// </summary>
        /// <value><c>true</c> if [show date time]; otherwise, <c>false</c>.</value>
        public bool ShowDateTime { get; set; }

        #region ILog Members

        /// <summary>Gets or sets a value indicating whether this <see cref="TraceLog"/> is trace.
        /// </summary>
        /// <value><c>true</c> if trace; otherwise, <c>false</c>.</value>
        public bool Trace { get; set; }

        /// <summary>Gets or sets a value indicating whether this <see cref="TraceLog"/> is debug.
        /// </summary>
        /// <value><c>true</c> if debug; otherwise, <c>false</c>.</value>
        public bool Debug { get; set; }

        /// <summary>Gets or sets a value indicating whether this <see cref="TraceLog"/> is info.
        /// </summary>
        /// <value><c>true</c> if info; otherwise, <c>false</c>.</value>
        public bool Info { get; set; }

        /// <summary>Writes the error.
        /// </summary>
        /// <param name="message">The message.</param>
        public void WriteError(string message)
        {
            string logMessage = null;
            if (ShowDateTime)
            {
                logMessage = DateTime.Now.ToString(TIME_FORMAT) + message;
            }
            else
            {
                logMessage = message;
            }

            System.Diagnostics.Trace.TraceError(logMessage);
            Console.Error.WriteLine(logMessage);
        }

        /// <summary>Writes the error.
        /// </summary>
        /// <param name="format">The format.</param>
        /// <param name="messages">The messages.</param>
        public void WriteError(string format, params object[] messages)
        {
            string formattedMessage = format;
            try
            {
                formattedMessage = string.Format(format, messages);
            }
            catch (FormatException)
            {
                // Ignore format exceptions
            }

            string logMessage = null;
            if (ShowDateTime)
            {
                logMessage = formattedMessage + DateTime.Now.ToString(TIME_FORMAT);
            }
            else
            {
                logMessage = formattedMessage;
            }

            System.Diagnostics.Trace.TraceError(logMessage);
            Console.Error.WriteLine(logMessage);
        }

        /// <summary>Writes the trace.
        /// </summary>
        /// <param name="message">The message.</param>
        public void WriteTrace(string message)
        {
            if (Trace)
            {
                if (ShowDateTime)
                {
                    System.Diagnostics.Trace.Write(DateTime.Now.ToString(TIME_FORMAT));
                }
                System.Diagnostics.Trace.WriteLine(message, m_category);
            }
        }

        /// <summary>Writes the trace.
        /// </summary>
        /// <param name="format">The format.</param>
        /// <param name="messages">The messages.</param>
        public void WriteTrace(string format, params object[] messages)
        {
            if (Trace)
            {
                string message = format;
                try
                {
                    message = string.Format(format, messages);
                }
                catch (FormatException)
                {
                    // Ignore format exceptions
                }
                if (ShowDateTime)
                {
                    System.Diagnostics.Trace.Write(DateTime.Now.ToString(TIME_FORMAT));
                }
                System.Diagnostics.Trace.WriteLine(message, m_category);
            }
        }

        /// <summary>Writes the debug.
        /// </summary>
        /// <param name="message">The message.</param>
        public void WriteDebug(string message)
        {
            if (Debug)
            {
                if (ShowDateTime)
                {
                    System.Diagnostics.Trace.Write(DateTime.Now.ToString(TIME_FORMAT));
                }
                System.Diagnostics.Trace.WriteLine(message);
            }
        }

        /// <summary>Writes the debug.
        /// </summary>
        /// <param name="format">The format.</param>
        /// <param name="messages">The messages.</param>
        public void WriteDebug(string format, params object[] messages)
        {
            if (Debug)
            {
                string message = format;
                try
                {
                    message = string.Format(format, messages);
                }
                catch (FormatException)
                {
                    // Ignore format exceptions
                }
                if (ShowDateTime)
                {
                    System.Diagnostics.Trace.Write(DateTime.Now.ToString(TIME_FORMAT));
                }
                System.Diagnostics.Trace.WriteLine(message);
            }
        }

        /// <summary>Message is always written to log, irrespective of Trace and Debug settings
        /// </summary>
        /// <param name="message"></param>
        public void WriteInfo(string message)
        {
            if (Info)
            {
                if (ShowDateTime)
                {
                    System.Diagnostics.Trace.Write(DateTime.Now.ToString(TIME_FORMAT));
                }
                System.Diagnostics.Trace.TraceInformation(message);
            }
        }

        /// <summary>Message is always written to log, irrespective of Trace and Debug settings
        /// </summary>
        /// <param name="format"></param>
        /// <param name="messages"></param>
        public void WriteInfo(string format, params object[] messages)
        {
            if (Info)
            {
                if (ShowDateTime)
                {
                    System.Diagnostics.Trace.Write(DateTime.Now.ToString(TIME_FORMAT));
                }
                System.Diagnostics.Trace.TraceInformation(format, messages);
            }
        }

        /// <summary>Sets a value indicating whether [lock file].
        /// </summary>
        /// <value><c>true</c> if [lock file]; otherwise, <c>false</c>.</value>
        public bool LockLogger
        {
            set
            {
                // Do nothing
            }
        }

        /// <summary>Sets the log location. This will be the category used when writing debug and trace information
        /// </summary>
        /// <param name="storageLocationInfo">The storage location info.</param>
        public void SetLogLocation(params object[] storageLocationInfo)
        {
            if ( storageLocationInfo != null && storageLocationInfo.Length > 0 )
            {
                m_category = storageLocationInfo[0] as string;
            }
        }

        /// <summary>Gets the log location.
        /// </summary>
        /// <value>The log location.</value>
        public string LogLocation
        {
            get { return ".NET Trace"; }
        }

        /// <summary>Releases unmanaged and - optionally - managed resources
        /// </summary>
        public void Dispose()
        {
            // Do nothing
        }

        #endregion
    }
}
