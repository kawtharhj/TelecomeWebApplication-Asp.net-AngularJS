using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace VanriseInternship_KawtharHijazi.Models.CustomValidations
{
	public class AdultAgeValidation : ValidationAttribute
	{
		public override bool IsValid(object value)
		{
			if(value is DateTime dateTime)
			{
				int age = DateTime.Today.Year - dateTime.Year;
				if (age > 18) return true;
			}

			return false;
		}
	}
}