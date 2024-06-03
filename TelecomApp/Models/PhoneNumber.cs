using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace VanriseInternship_KawtharHijazi.Models
{
	public class PhoneNumber
	{
		[Key]
		public int Id { get; set; }
		[Required]
		[RegularExpression(@"^\d{3}-\d{3}-\d{4}$", ErrorMessage = "Phone number must be in the format 123-456-7890")]
		public string Number { get; set; }

		public int DeviceId { get; set; }
		public string DeviceName { get; set; }
		public Device Device { get; set; }
	}
	public class PhoneNumberModel
	{
		public PhoneNumber Phone { get; set; }
		public int DeviceId { get; set; }
	}
}
