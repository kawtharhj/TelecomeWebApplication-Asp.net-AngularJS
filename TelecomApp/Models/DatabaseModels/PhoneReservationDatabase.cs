using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;

namespace VanriseInternship_KawtharHijazi.Models.DatabaseModels
{
	public class PhoneReservationDatabase
	{
		private string connectionString = ConfigurationManager.ConnectionStrings["MyConnectionString"].ConnectionString;

		public IEnumerable<PhoneReservation> GetAllPhonesReservation()
		{
			List<PhoneReservation> phoneReservations = new List<PhoneReservation>();

			using (SqlConnection connection = new SqlConnection(connectionString))
			{
				connection.Open();
				string procedureName = "GetPhoneNumberReservations";

				using (SqlCommand command = new SqlCommand(procedureName, connection))
				{
					command.CommandType = CommandType.StoredProcedure;

					using (SqlDataReader reader = command.ExecuteReader())
					{
						while (reader.Read())
						{
							PhoneReservation phoneReservation = new PhoneReservation
							{
								Id = reader.GetInt32(0),
								BED = reader.GetDateTime(1),
								EED = reader.IsDBNull(2) ? null : (DateTime?)reader.GetDateTime(2),
								ClientId = reader.GetInt32(3),
								PhoneNumberId = reader.GetInt32(4),
								ClientName = reader.GetString(5),
								PhoneNumber = reader.GetString(6)
							};
							phoneReservations.Add(phoneReservation);
						}
					}
				}
			}
			return phoneReservations;
		}


		public bool AddReservation(ReservationData phoneReservation)
		{
			using (SqlConnection connection = new SqlConnection(connectionString))
			{
				connection.Open();
				string query = "AddNewReservation";
				using (SqlCommand command = new SqlCommand(query, connection))
				{
					command.CommandType = CommandType.StoredProcedure;
					command.Parameters.AddWithValue("@ClientId", phoneReservation.ClientId);
					command.Parameters.AddWithValue("@PhoneNumberId", phoneReservation.PhoneNumberId);

					string result = command.ExecuteScalar()?.ToString();

					if (result == "Success")
					{
						return true;
					}
					else if (result == "Failure")
					{
						return false;
					}
					else
					{
						throw new Exception("Unexpected result from stored procedure");
					}
				}

			}
		}

		public IEnumerable<PhoneReservation> GetReservedPhoneNumbers(int ID)
		{
			List<PhoneReservation> phoneReservations = new List<PhoneReservation>();
			using (SqlConnection connection = new SqlConnection(connectionString))
			{
				connection.Open();
				string query = "GetReservedPhoneNumbers";
				using (SqlCommand command = new SqlCommand(query, connection))
				{
					command.CommandType = CommandType.StoredProcedure;
					command.Parameters.AddWithValue("@ClientId", ID);
					using (SqlDataReader reader = command.ExecuteReader())
					{
						while (reader.Read())
						{
							PhoneReservation phoneReservation = new PhoneReservation
							{
								Id = reader.GetInt32(0),
								BED = reader.GetDateTime(1),
								EED = reader.IsDBNull(2) ? null : (DateTime?)reader.GetDateTime(2),
								ClientId = reader.GetInt32(3),
								PhoneNumberId = reader.GetInt32(4),
								PhoneNumber = reader.GetString(5),
								ClientName = reader.GetString(6),
							};
							phoneReservations.Add(phoneReservation);
						}
					}
				}
			}
			return phoneReservations;
		}
		public void UnreservePhoneNumber(int PhoneNumberId)
		{
			using (SqlConnection connection = new SqlConnection(connectionString))
			{
				connection.Open();
				string query = "UnreservePhoneNumber";
				using (SqlCommand command = new SqlCommand(query, connection))
				{
					command.CommandType = CommandType.StoredProcedure;
					command.Parameters.AddWithValue("@PhoneNumberId", PhoneNumberId);
					command.ExecuteNonQuery();
				}
			}
		}






		public static PhoneReservation MapPhoneRes(SqlDataReader reader)
		{
			PhoneReservation phone = new PhoneReservation
			{
				Id = reader.GetInt32(0),
				BED = (DateTime)reader.GetDateTime(1),
				EED = reader.IsDBNull(2) ? null : (DateTime?)reader.GetDateTime(2),
				ClientId = reader.GetInt32(3),
				PhoneNumberId = reader.GetInt32(4),
			};
			return phone;
		}
	}

}