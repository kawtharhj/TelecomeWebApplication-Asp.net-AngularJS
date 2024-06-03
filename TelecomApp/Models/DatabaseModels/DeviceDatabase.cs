using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;

namespace VanriseInternship_KawtharHijazi.Models.DatabaseModels
{
	public class DeviceDatabase
	{
		public bool ConnectionStatus { get; private set; }
		public string ConnectionMessage { get; private set; }
		private string connectionString = ConfigurationManager.ConnectionStrings["MyConnectionString"].ConnectionString;

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


		public IEnumerable<Device> GetDevices()
		{
			List<Device> devices = new List<Device>();

			using (SqlConnection connection = new SqlConnection(connectionString))
			{
				connection.Open();
				string ProcedureName = "GetAllDevices";

				using (SqlCommand command = new SqlCommand(ProcedureName, connection))
				{
					command.CommandType = CommandType.StoredProcedure;

					using (SqlDataReader reader = command.ExecuteReader())
					{
						while (reader.Read())
						{
							Device device = new Device
							{
								ID = reader.GetInt32(0),
								Name = reader.GetString(1),
							};
							devices.Add(device);
						}
					}
				}
			}
			return devices;
		}


		public void AddDevice(Device device)
		{
			using (SqlConnection connection = new SqlConnection(connectionString))
			{
				connection.Open();
				string ProcedureName = "AddDevice";

				using (SqlCommand command = new SqlCommand(ProcedureName, connection))
				{
					// command.Parameters.AddWithValue("@dID", device.ID); since auto increment
					command.CommandType = CommandType.StoredProcedure;
					command.Parameters.AddWithValue("@Name", device.Name);
					command.ExecuteNonQuery();
				}
			}
			return;
		}

		public void UpdateDevice(Device device)
		{
			using (SqlConnection connection = new SqlConnection(connectionString))
			{
				connection.Open();
				string ProcedureName = "UpdateDevice";

				using (SqlCommand command = new SqlCommand(ProcedureName, connection))
				{
					command.CommandType = CommandType.StoredProcedure;
					command.Parameters.AddWithValue("@DeviceId", device.ID);
					command.Parameters.AddWithValue("@Name", device.Name);

					command.ExecuteNonQuery();
				}
			}
		}

		public IEnumerable<DeviceReport> GetAllDeviceReports()
		{
			List<DeviceReport> devices = new List<DeviceReport>();

			using (SqlConnection connection = new SqlConnection(connectionString))
			{
				connection.Open();
				string ProcedureName = "GetAllDeviceReports";

				using (SqlCommand command = new SqlCommand(ProcedureName, connection))
				{
					command.CommandType = CommandType.StoredProcedure;

					using (SqlDataReader reader = command.ExecuteReader())
					{
						while (reader.Read())
						{
							DeviceReport device = new DeviceReport
							{
								DeviceId = reader.GetInt32(reader.GetOrdinal("DeviceId")),
								DeviceName = reader.GetString(reader.GetOrdinal("DeviceName")),
								ReservedCount = reader.GetInt32(reader.GetOrdinal("ReservedCount")),
								UnReservedCount = reader.GetInt32(reader.GetOrdinal("UnReservedCount"))
							};

							devices.Add(device);
						}
					}
				}
			}
			return devices;
		}

		public IEnumerable<Device> GetAllDevices()
		{
			List<Device> devices = new List<Device>();

			using (SqlConnection connection = new SqlConnection(connectionString))
			{
				connection.Open();
				string ProcedureName = "GetAllDevices";

				using (SqlCommand command = new SqlCommand(ProcedureName, connection))
				{
					command.CommandType = CommandType.StoredProcedure;

					using (SqlDataReader reader = command.ExecuteReader())
					{
						while (reader.Read())
						{
							Device device = MapDevice(reader);
							devices.Add(device);
						}
					}
				}
			}
			return devices;
		}



		public static Device MapDevice(SqlDataReader reader)
		{
			Device device = new Device
			{
				ID = reader.GetInt32(0),
				Name = reader.GetString(1),
			};
			return device;
		}
	}
}
