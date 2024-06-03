using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace VanriseInternship_KawtharHijazi.Controllers
{
    public class PhoneNumberViewController : Controller
    {
        // GET: PhoneNumberView
        public ActionResult PhoneNumber()
        {
            return View();
        }

        public ActionResult PhoneReservationView()
        {
            return View();
        }

		public ActionResult ResUnResView()
		{
			return View();
		}
	}
}