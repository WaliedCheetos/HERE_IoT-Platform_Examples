using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace HERE_IoT_Platform_Examples.Controllers
{
    public class HERE_TAController : Controller
    {
        public IActionResult Index()
        {
            return View(); 
        }
    }
}