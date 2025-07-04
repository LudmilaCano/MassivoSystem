﻿using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace MassivoProject.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProvinceController : ControllerBase
    {
        private readonly IProvinceService _provinceService;
        public ProvinceController(IProvinceService provinceService)
        {
            _provinceService = provinceService;
        }


        [HttpGet]
        public async Task<IActionResult> GetAllProvince()
        {
            var provinces = await _provinceService.GetAllProvincesAsync();
            return Ok(provinces);
        }
    }
}
