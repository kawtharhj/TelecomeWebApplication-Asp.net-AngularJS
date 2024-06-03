using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace VanriseInternship_KawtharHijazi.Models
{
	public class UserData
	{
		public int ID { get; set; }
		[Required(ErrorMessage = "Username is required")]
		public string UserName { get; set; }

		[Required]
		[DataType(DataType.Password)]
		[MinLength(6, ErrorMessage = "Password must be at least 6 characters long")]
		public string HashedPasswrod { get; set; }
	}
}