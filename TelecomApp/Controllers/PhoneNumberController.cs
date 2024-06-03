using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using VanriseInternship_KawtharHijazi.Models;
using VanriseInternship_KawtharHijazi.Models.DatabaseModels;

namespace VanriseInternship_KawtharHijazi.Controllers
{
    public class PhoneNumberController : ApiController
    {
		private readonly PhoneNumberDatabase database;

		public PhoneNumberController()
		{
			database = new PhoneNumberDatabase();
		}



		[HttpGet]
		public IEnumerable<PhoneNumber> GetAllPhones()
		{
			return database.GetAllPhones();
		}

		[HttpPost]
		public IHttpActionResult AddPhoneNumber(PhoneNumberModel phoneModel)
		{
			database.AddPhoneNumber(phoneModel.Phone, phoneModel.DeviceId);
			return Ok(phoneModel);
		}

		[HttpPut]
		[Route("api/PhoneNumber/UpdatePhone/{id}")]
		public IHttpActionResult UpdatePhone(int id, PhoneNumber phone)
		{
			phone.Id = id;
			database.UpdatePhone(phone);
			return Ok(phone);
		}
	}
}
