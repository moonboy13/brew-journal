using DatabaseConnector;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text.Json;
using DevProps = BrewJournal.Server.Properties.DeveloperResources;
using UserProps = BrewJournal.Server.Properties.UserResources;
using System.Threading.Tasks;

namespace BrewJournal.Server.Controllers
{
	/// <summary>
	/// Base controller for CRUD operations. Does not define any endpoints itself but centralizes
	/// logging logic and some error handling.
	/// </summary>
	/// <typeparam name="TController"></typeparam>
	public class BaseCrudController<TController> : ControllerBase
	{
		protected readonly BaseDBContext _context;
		protected readonly ILogger<TController> _logger;

		public BaseCrudController(BaseDBContext context, ILogger<TController> logger)
		{
			_context = context;
			_logger = logger;
		}
		/// <summary>
		/// Selects the data based off the provide query. The primary value add here
		/// is that logging is centralized
		/// </summary>
		/// <typeparam name="DBEntity"></typeparam>
		/// <param name="query"></param>
		/// <returns></returns>
		protected IEnumerable<DBEntity> SelectData<DBEntity>(IOrderedQueryable<DBEntity> query)
			where DBEntity : class
		{
			Stopwatch timer = GetAndStartTimer();

			var hopList = query.ToList();

			_logger.LogInformation(DevProps.RetreivedAll, nameof(DBEntity));
			_logger.LogTrace(DevProps.ElapsedTime, DevProps.RetrieveAll.ToLower(), nameof(DBEntity), timer?.Elapsed.Seconds ?? 0);
			return hopList;
		}

		/// <summary>
		/// Add the new entry to the database, or return an error message if model validation fails.
		/// </summary>
		/// <typeparam name="DBEntity"></typeparam>
		/// <param name="newEntity"></param>
		/// <returns></returns>
		protected async Task<IActionResult> CreateRecord<DBEntity>(DBEntity newEntity)
			where DBEntity : class
		{
			//-- Only allocate space for and start a timer if we are running a trace log level
			Stopwatch timer = GetAndStartTimer();

			//-- Save to the database if the model is valid, otherwise return the validation errors to the UI
			if (ModelState.IsValid)
			{
				_context.Add(newEntity);
				var written = await _context.SaveAsync();
				if (written > 0)
				{
					_logger.LogInformation(DevProps.RecordCreated, nameof(DBEntity), JsonSerializer.Serialize(newEntity));
					_logger.LogTrace(DevProps.ElapsedTime, DevProps.Create.ToLower(),
						nameof(DBEntity), timer?.Elapsed.Seconds ?? 0);
					return Ok(newEntity);
				}
				else
				{
					_logger.LogError(DevProps.DBCreateWriteFail, nameof(DBEntity), JsonSerializer.Serialize(newEntity));
					_logger.LogTrace(DevProps.ElapsedTime, DevProps.FailToCreate.ToLower(),
						nameof(DBEntity), timer?.Elapsed.Seconds ?? 0);
					return Problem(UserProps.UnkownError);
				}
			}
			else
			{
				_logger.LogInformation(string.Format(DevProps.FailedToValidate, nameof(DBEntity)), JsonSerializer.Serialize(newEntity));
				_logger.LogTrace(string.Format(DevProps.ElapsedTime, DevProps.FailedToValidate, nameof(DBEntity), timer?.Elapsed.Seconds ?? 0));
				return ValidationProblem(ModelState);
			}
		}

		protected async Task<IActionResult> DeleteRecord<DBEntity>(int id)
			where DBEntity : class
		{
			var timer = GetAndStartTimer();

			DBEntity record = await _context.FindAsync<DBEntity>(id);
			
			//-- Throw a 404 error if we cannot find the record.
			if(record is null)
			{
				_logger.LogError(DevProps.FailedToFindRecord, nameof(DBEntity), id);
				return NotFound(id);
			}

			_logger.LogInformation(DevProps.DeletingRecord, JsonSerializer.Serialize(record));
			
			_ = await _context.DeleteAsync(record);
			
			_logger.LogTrace(DevProps.ElapsedTime, DevProps.Delete.ToLowerInvariant(), nameof(DBEntity), timer?.Elapsed.TotalSeconds ?? 0);
			
			return Ok();
		}



		private Stopwatch GetAndStartTimer()
		{
			Stopwatch timer = null;
			if (_logger.IsEnabled(LogLevel.Trace))
			{
				timer = new Stopwatch();
				timer.Start();
			}

			return timer;
		}
	}
}
