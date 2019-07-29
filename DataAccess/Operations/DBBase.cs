using System;
using System.Collections.Generic;
using System.Text;

namespace DataAccess.Operations
{
    public class DBBase
    {

        protected static DateTime MinSQLDate = new DateTime(1753, 1, 1);

        public int GetInt32(object dataRowObject)
        {
            return GetInt32(dataRowObject, 0);
        }

        public int GetInt32(object dataRowObject, int defaultValue)
        {
            int returnValue = defaultValue;
            if (dataRowObject != null && dataRowObject != DBNull.Value)
            {
                Int32.TryParse(dataRowObject.ToString(), out returnValue);
            }
            return returnValue;
        }

        public double GetDouble(object dataRowObject)
        {
            return GetDouble(dataRowObject, 0);
        }

        public double GetDouble(object dataRowObject, double defaultValue)
        {
            double returnValue = defaultValue;
            if (dataRowObject != null && dataRowObject != DBNull.Value)
            {
                Double.TryParse(dataRowObject.ToString(), out returnValue);
            }
            return returnValue;
        }

        public bool GetBool(object dataRowObject)
        {
            return GetBool(dataRowObject, false);
        }

        public bool GetBool(object dataRowObject, bool defaultValue)
        {
            bool returnValue = defaultValue;
            if (dataRowObject != null && dataRowObject != DBNull.Value)
            {
                Boolean.TryParse(dataRowObject.ToString(), out returnValue);
            }
            return returnValue;
        }

        public string GetString(object dataRowObject, string defaultValue)
        {
            string returnValue = defaultValue;
            if (dataRowObject != null && dataRowObject != DBNull.Value)
            {
                returnValue = dataRowObject.ToString();
            }
            return returnValue;
        }

        public string GetString(object dataRowObject)
        {
            return dataRowObject as string;
        }

        public DateTime GetDate(object dataRowObject)
        {
            return GetDate(dataRowObject, DateTime.Now);
        }

        public DateTime GetDate(object dataRowObject, DateTime defaultValue)
        {
            DateTime returnValue = defaultValue;
            if (dataRowObject != null && dataRowObject != DBNull.Value)
            {
                DateTime.TryParse(dataRowObject.ToString(), out returnValue);
            }
            return returnValue;
        }

        public string GetDateAsString(object dataRowObject, string format, string defaultValue)
        {
            string returnValue = defaultValue;
            if (dataRowObject != null && dataRowObject != DBNull.Value)
            {
                DateTime dt = DateTime.MinValue;
                if (DateTime.TryParse(dataRowObject.ToString(), out dt))
                {
                    returnValue = dt.ToString(format);
                }
            }
            return returnValue;
        }

    }
}
