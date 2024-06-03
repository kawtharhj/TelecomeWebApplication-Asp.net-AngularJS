using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using VanriseInternship_KawtharHijazi.Models.DatabaseModels;
using VanriseInternship_KawtharHijazi.Models;

namespace VanriseInternship_KawtharHijazi.Controllers
{
    public class ClientController : ApiController
    {
		private readonly ClientDatabase database;
		// GET: Client


		public ClientController()
		{
			database = new ClientDatabase();
		}

		[HttpGet]
		public IEnumerable<Client> GetAllClients()
		{
			return database.GetAllClients();
		}

		//[HttpGet]
		//[Route("api/Client/GetType/")]
		//public IEnumerable<int> GetClientType()
		//{
		//	return database.GetClientType();
		//}

		[HttpGet]
		[Route("api/Client/GetClientCounts")]
		public IHttpActionResult GetClientCounts()
		{
			var clientCounts = database.GetClientCounts();
			return Ok(clientCounts);
		}

		[HttpPost]
		public IHttpActionResult AddClient(Client client)
		{
			database.AddClient(client);
			return Ok(client);
		}

		[HttpPut]
		[Route("api/Client/UpdateClient/{id}")]
		public IHttpActionResult UpdateClient(int id, Client client)
		{
			client.ID = id;
			database.UpdateClient(client);
			return Ok(client);
		}
	}
}
