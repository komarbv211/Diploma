using Microsoft.AspNetCore.Mvc;

namespace WebApiDiploma.Controllers.Public
{
    public class PublicBrandController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
