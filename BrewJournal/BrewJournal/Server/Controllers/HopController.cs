using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Models;
using DatabaseConnector.Sqlite;
using Microsoft.Extensions.Logging;

namespace BrewJournal.Server.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class HopController : ControllerBase
	{
		//-- TODO interface this out to be generic
		private readonly SqliteDBContext _context;
		private readonly ILogger<HopController> _logger;

		public HopController(SqliteDBContext context, ILogger<HopController> logger)
		{
			_context = context;
			_logger = logger;
		}

		[HttpGet]
		public async Task<IEnumerable<Hop>> Index()
		{
			await Task.CompletedTask;

			var query = 
				from hop in _context.Hop
				orderby hop.Name
				select hop;

			return query.ToList();
		}

		[HttpPost]
		[ValidateAntiForgeryToken]
		public async Task<IActionResult> Create([Bind("Name,AlphaAcidContent,BetaAcidContent")] Hop hop)
		{
			//-- Save to the database if the model is valid, otherwise return the validation errors to the UI
			if(ModelState.IsValid)
			{
				_context.Hop.Add(hop);
				var written = await _context.SaveAsync();
				if (written > 0)
				{
					return Ok(hop);
				}
				else
				{
					return Problem("Unknown error occured when saving data");
				}
			}
			else
			{
				return ValidationProblem(ModelState);
			}
		}
	}
}
