using System;
using System.Collections.Generic;
using System.Text;

namespace EncryptDecryptMagic.EncryptDecrypt
{
    public class EncryptDecrypt
    {
        public enum _enum_EncryptionDecryptionSecret { SECRET1, SECRET2, SECRET3};

        public static string _fx_Encrypt(string DecryptedString, _enum_EncryptionDecryptionSecret EncryptionDecryptionSecret, LoggingFramework.ILog iLog, string UserTag)
        {
            string EncryptedString = string.Empty;
            try
            {
                iLog.WriteDebug("Encryption - Decrypted String {0}", DecryptedString);

                switch (EncryptionDecryptionSecret)
                {
                    case _enum_EncryptionDecryptionSecret.SECRET1:
                    case _enum_EncryptionDecryptionSecret.SECRET2:
                    case _enum_EncryptionDecryptionSecret.SECRET3:
                    default:
                        EncryptedString = DecryptedString;
                        break;
                }
            }
            catch (Exception exception)
            {
                iLog.WriteError(exception.ToString());
            }
            finally
            { }

            return EncryptedString;
        }

        public static string _fx_Decrypt(string EncryptedString, _enum_EncryptionDecryptionSecret EncryptionDecryptionSecret, LoggingFramework.ILog iLog, string UserTag)
        {
            string DecryptedString = string.Empty;
            try
            {
                iLog.WriteDebug("Decryption - Encrypted String {0}", EncryptedString);

                switch (EncryptionDecryptionSecret)
                {
                    case _enum_EncryptionDecryptionSecret.SECRET1:
                    case _enum_EncryptionDecryptionSecret.SECRET2:
                    case _enum_EncryptionDecryptionSecret.SECRET3:
                    default:
                        DecryptedString = EncryptedString;
                        break;
                }
            }
            catch (Exception exception)
            {
                iLog.WriteError(exception.ToString());
            }
            finally
            { }

            return DecryptedString;
        }
    }
}
