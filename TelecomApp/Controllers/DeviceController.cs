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
    public class DeviceController : ApiController
    {
		private readonly DeviceDatabase db;

		public DeviceController()
		{
			db = new DeviceDatabase();
		}
		[HttpGet]
		public IEnumerable<Device> GetAllDevices()
		{
			return db.GetAllDevices();
		}

		[HttpGet]
		[Route("api/Device/GetAllDeviceReports")]
		public IHttpActionResult GetAllDeviceReports()
		{
			var devicesRe = db.GetAllDeviceReports();

			return Ok(devicesRe);
		}
		[HttpPost]
		public IHttpActionResult AddDevice(Device device)
		{
			db.AddDevice(device);
			return Ok(device);
		}

		[HttpPut]

		[Route("api/Device/UpdateDevice/{id}")]
		public IHttpActionResult UpdateDevice(int id, Device device)
		{
			device.ID = id;
			db.UpdateDevice(device);
			return Ok(device);
		}
	}
}
