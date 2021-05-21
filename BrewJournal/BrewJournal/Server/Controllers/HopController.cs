using DatabaseConnector;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BrewJournal.Server.Controllers
{
	[ApiController]
	[Route("[controller]")]
	public class HopController : BaseCrudController<HopController>
	{
		public HopController(BaseDBContext context, ILogger<HopController> logger)
			: base(context, logger)
		{
		}

		[HttpGet]
		public async Task<IEnumerable<Hop>> Index()
		{
			await Task.CompletedTask;

			var query =
				from hop in _context.Hop
				orderby hop.Name
				select hop;

			return SelectData(query);
		}

		[HttpPost]
		public async Task<IActionResult> Create([Bind(nameof(Hop.Name), nameof(Hop.AlphaAcidContent), nameof(Hop.BetaAcidContent))] Hop hop)
		{
			return await CreateRecord(hop);
		}

		[HttpDelete("{id}")]
		public async Task<IActionResult> Delete(int id)
		{
			return await DeleteRecord<Hop>(id);
		}
	}
}
