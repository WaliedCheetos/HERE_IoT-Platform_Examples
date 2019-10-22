using EncryptDecryptMagic.EncryptDecrypt;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.IO;
using System.Text;




namespace DataAccess.Admin
{
    public class DataAccessManager
    {
        //private static string _connectionString = 
        //private static string _connectionString = ConnectionString();

            /// <summary>
            /// Gets sql connection for any CRUD operation that could happen
            /// </summary>
            /// <param name="iLog">ILog object reference to be used for logging</param>
            /// <returns></returns>
        public static SqlConnection _fx_GetSqlConnection(LoggingFramework.ILog iLog, string UserTag)
        {
            SqlConnection sqlConnection = null;
            try
            {
                sqlConnection = new SqlConnection(_fx_GetConnectionString(iLog));
                if (sqlConnection.State != System.Data.ConnectionState.Open)
                    sqlConnection.Open();

                iLog.WriteDebug("Database connection with connection String: {0} has been opened", sqlConnection.ConnectionString);

            }
            catch (Exception exception)
            {
                iLog.WriteError(exception.ToString());
            }
            finally
            { }
            return sqlConnection;
        }

        /// <summary>
        /// Gets sql connection
        /// </summary>
        /// <param name="iLog">ILog object reference to be used for logging</param>
        /// <returns></returns>
        public static string _fx_GetConnectionString(LoggingFramework.ILog iLog)
        {
            string ConnectionString = string.Empty;

            try
            {
                IConfigurationBuilder builder = new ConfigurationBuilder();
                builder.AddJsonFile(Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json"));

                var root = builder.Build();
                var connString = root.GetConnectionString("WaliedCheetos-HERE_DB");

                ConnectionString = EncryptDecrypt._fx_Decrypt(
                    connString,
                    EncryptDecrypt._enum_EncryptionDecryptionSecret.SECRET1,
                    iLog,
                    string.Empty);

                iLog.WriteDebug("Connection String: {0}", ConnectionString);
            }
            catch (Exception exception)
            {
                iLog.WriteError(exception.ToString());
            }
            finally
            { }
            return ConnectionString;
        }
    }
}
