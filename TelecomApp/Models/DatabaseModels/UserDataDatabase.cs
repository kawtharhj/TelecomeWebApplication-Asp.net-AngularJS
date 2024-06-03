using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Web;

namespace VanriseInternship_KawtharHijazi.Models.DatabaseModels
{
	public class UserDataDatabase
	{
		private string connectionString = ConfigurationManager.ConnectionStrings["MyConnectionString"].ConnectionString;


		public void AddNewUser(string username, string password)
		{
			using (SqlConnection connection = new SqlConnection(connectionString))
			{
				connection.Open();
				string query = "AddNewUser";

				using (SqlCommand command = new SqlCommand(query, connection))
				{
					string hashpass = HashingPassword(password);

					command.CommandType = CommandType.StoredProcedure;
					command.Parameters.AddWithValue("@userName", username);
					command.Parameters.AddWithValue("@password", hashpass);
					command.ExecuteNonQuery();
				}
			}
		}


		public bool VerifyUser(string username, string password)
		{
			using (SqlConnection connection = new SqlConnection(connectionString))
			{
				connection.Open();
				string query = "CheckUser";


				using (SqlCommand command = new SqlCommand(query, connection))
				{
					string hashpass = HashingPassword(password);

					command.CommandType = CommandType.StoredProcedure;
					command.Parameters.AddWithValue("@UserName", username);
					command.Parameters.AddWithValue("@password", hashpass);

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


		public static string HashingPassword(string password)
		{
			using (var sha256 = SHA256.Create())
			{
				byte[] passwordBytes = Encoding.UTF8.GetBytes(password);
				byte[] hashedBytes = sha256.ComputeHash(passwordBytes);
				return Convert.ToBase64String(hashedBytes);
			}
		}

	}
}