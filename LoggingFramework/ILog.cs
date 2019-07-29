using System;

namespace LoggingFramework
{
	/// <summary>
	/// Summary description for ILog.
	/// </summary>
	public interface ILog
	{
        bool Trace { get; set;}
        bool Debug { get; set;}
        bool Info { get;set;}
        void WriteError(string message);
        void WriteError(string format, params object[] messages);
        void WriteTrace(string message);
        void WriteTrace(string format, params object[] messages);

        void WriteDebug(string message);
        void WriteDebug(string format, params object[] messages);

        /// <summary>
        /// Message is always written to log, irrespective of Trace and Debug settings
        /// </summary>
        /// <param name="message"></param>
        void WriteInfo(string message);

        /// <summary>
        /// Message is always written to log, irrespective of Trace and Debug settings
        /// </summary>
        /// <param name="format"></param>
        /// <param name="messages"></param>
        void WriteInfo(string format, params object[] messages);

		bool LockLogger { set;}

        void SetLogLocation(params object[] storageLocationInfo);
        string LogLocation { get;}

        void Dispose();
    }
}

