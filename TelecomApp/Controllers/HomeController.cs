using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace VanriseInternship_KawtharHijazi.Controllers
{
	public class HomeController : Controller
	{
		public ActionResult Index()
		{
			return View();
		}

		public ActionResult ClientView()
		{
			return View();
		}

		public ActionResult ClientReportView()
		{
			return View();
		}

		public ActionResult LoginView()
		{
			return View();
		}
	}
}