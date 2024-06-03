using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using VanriseInternship_KawtharHijazi.Models.DatabaseModels;

namespace VanriseInternship_KawtharHijazi.Controllers
{
    public class LoginController : ApiController
	{
		private readonly UserDataDatabase database;

		public LoginController()
		{
			database = new UserDataDatabase();
		}


		[HttpGet]
		[Route("api/Login/VerifyUser/{username}/{password}")]
		public IHttpActionResult VerifyUser(string username, string password)
		{
			bool isValidLogin = database.VerifyUser(username, password);
			if (isValidLogin) return Ok("Success");
			else return Ok("Failure");

		}

		[HttpPost]
		[Route("api/Login/AddNewUser/{username}/{password}")]
		public IHttpActionResult AddNewUser(string username, string password)
		{
			database.AddNewUser(username, password);
			return Ok();

		}

	}
}
