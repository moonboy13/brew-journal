using DatabaseConnector;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BrewJournal.Server.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class MaltController : BaseCrudController<MaltController>
	{
		public MaltController(BaseDBContext context, ILogger<MaltController> logger)
			: base(context, logger)
		{ }

		[HttpGet]
		public async Task<IEnumerable<Malt>> Index()
		{
			await Task.CompletedTask;

			//-- Since this is just a read and return I do not want
			//-- to track these entities. The AsNoTracking improves
			//-- performance
			var query =
				from hop in _context.Malt.AsNoTracking()
				orderby hop.Brand
				select hop;

			return SelectData(query);
		}

		[HttpPost]
		public async Task<IActionResult> Create([Bind(nameof(Malt.Brand), nameof(Malt.Type), nameof(Malt.Extract),
			nameof(Malt.Extract), nameof(Malt.Dry), nameof(Malt.Active))] Malt malt)
		{
			return await CreateRecord(malt);
		}

		[HttpPost("{id}")]
		public async Task<IActionResult> Modify(int id, Malt hop)
		{
			return await ModifyRecord(id, hop);
		}


		[HttpDelete("{id}")]
		public async Task<IActionResult> Delete(int id)
		{
			return await DeleteRecord<Malt>(id);
		}
	}
}
