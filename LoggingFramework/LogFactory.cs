using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LoggingFramework
{
    public static class LogFactory
    {
        public enum LogType
        {
            FileLog,
            BufferedFileLog,
            TraceLog,           
            Empty
        }
        public static ILog GetLogger(string logType, string location, string fileNamePrefix, bool debug, bool trace, bool writeInfo, bool lockLogger)
        {
            ILog logger = null;
            LogType lt = (LogType) (Enum.Parse(typeof(LogType), logType, true));

            if (string.IsNullOrEmpty(fileNamePrefix))
            {
                fileNamePrefix = "";
            }
            

            switch (lt)
            {
                case LogType.FileLog:
                    //if location is directory, change to file.
                    if (Directory.Exists(location))
                    {
                        location += "\\AppLog_" + fileNamePrefix + ".txt";
                    }
                    logger = new FileLog(location, trace, debug, lockLogger);
                    logger.Info = writeInfo;
                    break;

                case LogType.BufferedFileLog:
                    if (Directory.Exists(location))
                    {
                        location += "\\AppLog_" + fileNamePrefix + ".txt";
                    }
                    logger = new BufferedFileLog(location, trace, debug);
                    logger.Info = writeInfo;
                    break;

                case LogType.TraceLog:
                    logger = new TraceLog(trace, debug, true);
                    logger.Info = writeInfo;
                    break;

                case LogType.Empty:                   
                default:
                    logger = new EmptyLog();
                    break;
            }            

            return logger;
        }

        public static ILog GetLogger(NameValueCollection logSettings)
        {            
            return GetLogger(logSettings, "Log", null);
        }

        public static ILog GetLogger(NameValueCollection logSettings, string keyPrefix, string fileNamePrefix = null)
        {
            string logType = logSettings[keyPrefix  + ".Type"];
            string location = logSettings[keyPrefix + ".Location"];
            bool debug = ParseBool(logSettings[keyPrefix + ".Debug"]);
            bool trace = ParseBool(logSettings[keyPrefix + ".Trace"]);
            bool info = ParseBool(logSettings[keyPrefix + ".Info"]);
            bool lockLogger = ParseBool(logSettings[keyPrefix + ".LockLogger"]);

            return GetLogger(logType, location,fileNamePrefix, debug, trace, info, lockLogger);

        }

        private static bool ParseBool(string strBool)
        {
            bool val = false;
            try
            {
                val = Boolean.Parse(strBool);
            }
            catch (Exception exc)
            { }
            return val;
        }

    }
}
