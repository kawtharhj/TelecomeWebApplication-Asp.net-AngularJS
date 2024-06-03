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
    public class PhoneReservationController : ApiController
    {
		private readonly PhoneReservationDatabase database;

		public PhoneReservationController()
		{
			database = new PhoneReservationDatabase();
		}

		[HttpGet]
		public IEnumerable<PhoneReservation> GetAllPhonesReservation()
		{
			return database.GetAllPhonesReservation();
		}

		[HttpPost]
		public IHttpActionResult AddReservation(ReservationData phoneModel)
		{
			bool Reserved = database.AddReservation(phoneModel);
			if (Reserved) return Ok("Success");
			else return Ok("Failure");

		}

		[HttpGet]
		[Route("api/PhoneReservation/GetReservedPhoneNumbers/{ID}")]
		public IHttpActionResult GetReservedPhoneNumbers([FromUri] int ID)
		{
			var reservedPhoneNumbers = database.GetReservedPhoneNumbers(ID);
			return Ok(reservedPhoneNumbers);
		}

		[HttpPut]
		[Route("api/PhoneReservation/UnreservePhoneNumber/{PhoneNumberId}")]
		public IHttpActionResult UnreservePhoneNumber(int PhoneNumberId)
		{
			database.UnreservePhoneNumber(PhoneNumberId);
			return Ok();
		}
	}
}
