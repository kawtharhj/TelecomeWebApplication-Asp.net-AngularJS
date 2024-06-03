using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;

namespace VanriseInternship_KawtharHijazi.Models.DatabaseModels
{
	public class PhoneNumberDatabase
	{
		private string connectionString = ConfigurationManager.ConnectionStrings["MyConnectionString"].ConnectionString;
		public bool ConnectionStatus { get; private set; }
		public string ConnectionMessage { get; private set; }
		public bool TestConnection()
		{

			using (SqlConnection connection = new SqlConnection(connectionString))
			{
				try
				{
					connection.Open();
					ConnectionStatus = true;
					ConnectionMessage = "Connection succeeded!";
					return true;
				}
				catch (Exception ex)
				{
					ConnectionStatus = false;
					ConnectionMessage = "Connection failed: " + ex.Message;
					return false;
				}
			}
		}


		public IEnumerable<PhoneNumber> GetAllPhones()
		{
			List<PhoneNumber> phones = new List<PhoneNumber>();

			using (SqlConnection connection = new SqlConnection(connectionString))
			{
				connection.Open();
				string ProcedureName = "GetAllPhoneNumbersWithDeviceNames";

				using (SqlCommand command = new SqlCommand(ProcedureName, connection))
				{
					command.CommandType = CommandType.StoredProcedure;

					using (SqlDataReader reader = command.ExecuteReader())
					{
						while (reader.Read())
						{
							PhoneNumber phone = new PhoneNumber
							{
								Id = reader.GetInt32(0),
								Number = reader.GetString(1),
								DeviceId = reader.GetInt32(2),
								DeviceName = reader.GetString(3),
							};
							phones.Add(phone);
						}
					}
				}
			}
			return phones;
		}

		public void AddPhoneNumber(PhoneNumber phone, int deviceId)
		{
			using (SqlConnection connection = new SqlConnection(connectionString))
			{
				connection.Open();
				string ProcedureName = "AddPhoneNumber";

				using (SqlCommand command = new SqlCommand(ProcedureName, connection))
				{
					command.CommandType = CommandType.StoredProcedure;
					command.Parameters.AddWithValue("@Number", phone.Number);
					command.Parameters.AddWithValue("@DeviceType", deviceId);
					command.ExecuteNonQuery();
				}
			}
		}


		public void UpdatePhone(PhoneNumber phone)
		{
			using (SqlConnection connection = new SqlConnection(connectionString))
			{
				connection.Open();
				string ProcedureName = "UpdatePhone";

				using (SqlCommand command = new SqlCommand(ProcedureName, connection))
				{

					command.CommandType = CommandType.StoredProcedure;
					command.Parameters.AddWithValue("@PhoneId", phone.Id);
					command.Parameters.AddWithValue("@Number", phone.Number);
					command.Parameters.AddWithValue("@DeviceId", phone.DeviceId);
					command.ExecuteNonQuery();
				}
			}
		}



		public static PhoneNumber MapPhone(SqlDataReader reader)
		{
			PhoneNumber phone = new PhoneNumber
			{
				Id = reader.GetInt32(0),
				Number = reader.GetString(1),
				DeviceName = reader.GetString(2),
			};
			return phone;
		}


	}
}