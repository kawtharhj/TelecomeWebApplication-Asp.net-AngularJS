using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace VanriseInternship_KawtharHijazi.Models
{
	public class Device
	{
		[Key]
		public int ID { get; set; }
		[Required]
		[RegularExpression(@"^[a-zA-Z0-9_]+$", ErrorMessage = "Name should not start with special character")]
		public string Name { get; set; }
	}

	public class DeviceReport
	{
		public int DeviceId { get; set; }
		public string DeviceName { get; set; }
		// public string DeviceStatus { get; set; }
		public int ReservedCount { get; set; }
		public int UnReservedCount { get; set; }
	}
}