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
using DevProps = BrewJournal.Server.Properties.DeveloperResources;
using UserProps = BrewJournal.Server.Properties.UserResources;

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

			_logger.LogInformation(string.Format(DevProps.RetreivedAll, nameof(Hop)));
			_logger.LogTrace(string.Format(DevProps.ElapsedTime, DevProps.RetrieveAll.ToLower(), nameof(Hop), timer?.Elapsed.Seconds ?? 0));
			return hopList;
		}

		[HttpPost]
		public async Task<IActionResult> Create([Bind(nameof(Hop.Name),nameof(Hop.AlphaAcidContent),nameof(Hop.BetaAcidContent))] Hop hop)
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
					_logger.LogInformation(string.Format(DevProps.RecordCreated, nameof(Hop)), JsonSerializer.Serialize(hop));
					_logger.LogTrace(string.Format(DevProps.ElapsedTime, DevProps.Create.ToLower(),
						nameof(Hop), timer?.Elapsed.Seconds ?? 0));
					return Ok(hop);
				}
				else
				{
					_logger.LogError(string.Format(DevProps.DBCreateWriteFail, nameof(Hop)), JsonSerializer.Serialize(hop));
					_logger.LogTrace(string.Format(DevProps.ElapsedTime, DevProps.FailToCreate.ToLower(),
						nameof(Hop), timer?.Elapsed.Seconds ?? 0));
					return Problem(UserProps.UnkownError);
				}
			}
			else
			{
				_logger.LogInformation(string.Format(DevProps.FailedToValidate, nameof(Hop)), JsonSerializer.Serialize(hop));
				_logger.LogTrace(string.Format(DevProps.ElapsedTime, DevProps.FailedToValidate, nameof(Hop), timer?.Elapsed.Seconds ?? 0));
				return ValidationProblem(ModelState);
			}
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> Delete(int id)
		{
			Hop hopToDelete = new()
			{
				Id = id
			};
			_context.Entry(hopToDelete).State = Microsoft.EntityFrameworkCore.EntityState.Deleted;
			await _context.SaveChangesAsync();
			return Ok();
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
