using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Models;
using DatabaseConnector.Sqlite;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using System.Text.Json;

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
			Stopwatch timer = GetAndStartTimer();
			
			await Task.CompletedTask;

			var query = 
				from hop in _context.Hop
				orderby hop.Name
				select hop;

			var hopList = query.ToList();

			_logger.LogInformation("Retrieved all hops");
			_logger.LogTrace($"Elapsed time to retrieve all hops {timer?.Elapsed.Seconds ?? 0}");
			return hopList;
		}

		[HttpPost]
		[ValidateAntiForgeryToken]
		public async Task<IActionResult> Create([Bind("Name,AlphaAcidContent,BetaAcidContent")] Hop hop)
		{
			//-- Only allocate space for and start a timer if we are running a trace log level
			Stopwatch timer = GetAndStartTimer();

			//-- Save to the database if the model is valid, otherwise return the validation errors to the UI
			if(ModelState.IsValid)
			{
				_context.Hop.Add(hop);
				var written = await _context.SaveAsync();
				if (written > 0)
				{
					_logger.LogInformation("Hop Created", JsonSerializer.Serialize(hop));
					_logger.LogTrace($"Time to create hop {timer?.Elapsed.Seconds ?? 0}");
					return Ok(hop);
				}
				else
				{
					_logger.LogError("Database write failed when creating hop.", JsonSerializer.Serialize(hop));
					_logger.LogTrace($"Time for create hop failure {timer?.Elapsed.Seconds ?? 0}");
					return Problem("Unknown error occured when saving data");
				}
			}
			else
			{
				_logger.LogInformation("Hop failed to validate.", JsonSerializer.Serialize(hop));
				_logger.LogTrace($"Time for validation failure {timer?.Elapsed.Seconds ?? 0}");
				return ValidationProblem(ModelState);
			}
		}

		private Stopwatch GetAndStartTimer()
		{
			Stopwatch timer = null;
			if(_logger.IsEnabled(LogLevel.Trace))
			{
				timer = new Stopwatch();
				timer.Start();
			}

			return timer;
		}
	}
}
