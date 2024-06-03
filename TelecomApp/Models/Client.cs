using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using VanriseInternship_KawtharHijazi.Models.CustomValidations;

namespace VanriseInternship_KawtharHijazi.Models
{
	public class Client
	{
		
			[Key]
			public int ID { get; set; }
			[Required(ErrorMessage ="Name is required")]

			public string Name { get; set; }
			[Required]
			public ClientType ClientType { get; set; }

			[AdultAgeValidation(ErrorMessage ="Client Should be Over 18")]
			public DateTime? BirthDate { get; set; }
	}


	public enum ClientType
	{
		Individual = 0,
		Organization = 1,
	}
}



