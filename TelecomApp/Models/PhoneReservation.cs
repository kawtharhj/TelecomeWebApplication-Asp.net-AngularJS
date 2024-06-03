using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace VanriseInternship_KawtharHijazi.Models
{
	public class PhoneReservation
	{
		[Key]
		public int Id { get; set; }
		[Required]
		public DateTime BED { get; set; }
		public DateTime? EED { get; set; }
		public int ClientId { get; set; }
		public int PhoneNumberId { get; set; }
		public string PhoneNumber { get; set; }
		public string ClientName { get; set; }
	}

	public class ReservationData
	{
		public int ClientId { get; set; }
		public int PhoneNumberId { get; set; }
	}

}