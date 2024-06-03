using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;

namespace VanriseInternship_KawtharHijazi.Models.DatabaseModels
{
	public class ClientDatabase
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


		public IEnumerable<Client> GetAllClients()
		{
			List<Client> clients = new List<Client>();

			using (SqlConnection connection = new SqlConnection(connectionString))
			{
				connection.Open();
				string procedureName = "GetAllClients";

				using (SqlCommand command = new SqlCommand(procedureName, connection))
				{
					command.CommandType = CommandType.StoredProcedure;

					using (SqlDataReader reader = command.ExecuteReader())
					{
						while (reader.Read())
						{
							Client client = MapClient(reader);
							clients.Add(client);
						}
					}
				}
			}
			return clients;
		}

		public void AddClient(Client client)
		{
			using (SqlConnection connection = new SqlConnection(connectionString))
			{
				connection.Open();
				string ProcedureName = "AddClient";

				using (SqlCommand command = new SqlCommand(ProcedureName, connection))
				{
					// command.Parameters.AddWithValue("@dID", device.ID); since auto increment
					command.CommandType = CommandType.StoredProcedure;
					command.Parameters.AddWithValue("@Name", client.Name);
					command.Parameters.AddWithValue("@ClientType", (int)client.ClientType);

					if (client.ClientType == ClientType.Individual)
					{
						command.Parameters.AddWithValue("@BirthDate", client.BirthDate);
					}

					command.ExecuteNonQuery();
				}
			}
			return;
		}

		public void UpdateClient(Client client)
		{
			using (SqlConnection connection = new SqlConnection(connectionString))
			{
				connection.Open();
				string ProcedureName = "UpdateClient";

				using (SqlCommand command = new SqlCommand(ProcedureName, connection))
				{

					command.CommandType = CommandType.StoredProcedure;
					command.Parameters.AddWithValue("@ID", client.ID);
					command.Parameters.AddWithValue("@Name", client.Name);
					command.Parameters.AddWithValue("@ClientType", client.ClientType);
					command.Parameters.AddWithValue("@BirthDate", client.BirthDate);


					command.ExecuteNonQuery();
				}
			}
		}



		public List<Client> FilterByName(string Name)
		{
			List<Client> clients = new List<Client>();

			using (SqlConnection connection = new SqlConnection(connectionString))
			{
				connection.Open();
				string procedure = "NameFilter";
				using (SqlCommand command = new SqlCommand(procedure, connection))
				{
					command.CommandType = CommandType.StoredProcedure;
					command.Parameters.AddWithValue("@NameFilter", Name);
					using (SqlDataReader reader = command.ExecuteReader())
					{
						while (reader.Read())
						{
							Client cl = MapClient(reader);
							clients.Add(cl);
						}
					}
				}
			}
			return clients;
		}


		public List<ClientCount> GetClientCounts()
		{
			string query = "GetClientCounts";
			List<ClientCount> clientCounts = new List<ClientCount>();

			using (SqlConnection connection = new SqlConnection(connectionString))
			{
				connection.Open();
				using (SqlCommand command = new SqlCommand(query, connection))
				{
					command.CommandType = CommandType.StoredProcedure;
					using (SqlDataReader reader = command.ExecuteReader())
					{
						while (reader.Read())
						{
							int clientType = reader.GetInt32(0);
							int count = reader.GetInt32(1);

							ClientCount clientCount = new ClientCount
							{
								Type = clientType,
								Count = count
							};
							clientCounts.Add(clientCount);
						}
					}
				}
			}
			return clientCounts;
		}



		public static Client MapClient(SqlDataReader reader)
		{
			Client client = new Client
			{
				ID = reader.GetInt32(0),
				Name = reader.GetString(1),
				ClientType = (ClientType)reader.GetInt32(2),
				BirthDate = reader.IsDBNull(3) ? null : (DateTime?)reader.GetDateTime(3)

			};

			return client;
		}

	}
}