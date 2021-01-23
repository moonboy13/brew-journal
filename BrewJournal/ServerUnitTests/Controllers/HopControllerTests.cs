using NUnit.Framework;
using BrewJournal.Server.Controllers;
using System;
using System.Collections.Generic;
using System.Text;
using DatabaseConnector;
using Models;
using Moq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System.Linq;

namespace BrewJournal.Server.Controllers.Tests
{
	[TestFixture()]
	public class HopControllerTests
	{
		Mock<ILogger<HopController>> _logger;

		[SetUp]
		public void Setup()
		{
			_logger = new Mock<ILogger<HopController>>();
		}

		[Test()]
		public async Task Create_ValidData_SuccessfulCreate()
		{
			//-- Setup all our needed mocked objects. The context and logger probably
			//-- can probably be move up to a class Setup function
			var mockHopDBet = new Mock<DbSet<Hop>>();
			var mockContext = new Mock<DatabaseConnector.Sqlite.SqliteDBContext>();
			mockContext.Setup(context => context.Hop).Returns(mockHopDBet.Object);
			mockContext.Setup(context => context.SaveAsync()).ReturnsAsync(1);

			var hopController = new HopController(mockContext.Object, _logger.Object);
			var hop = new Hop()
			{
				Name = "foo",
				AlphaAcidContent = 5.5,
				BetaAcidContent = 1.0,
				Id = 0
			};

			var result = await hopController.Create(hop);

			mockHopDBet.Verify(m => m.Add(It.IsAny<Hop>()), Times.Once());
			mockContext.Verify(m => m.SaveAsync(), Times.Once());
		}

		[Test()]
		public async Task Index_GetHopsInNameOrder()
		{
			var hopList = new List<Hop>()
			{
				{ new Hop() { Name = "Alpha", AlphaAcidContent = 1.1, BetaAcidContent = 1.2 } },
				{ new Hop() { Name = "Gamma", AlphaAcidContent = 3.1, BetaAcidContent = 3.2 } },
				{ new Hop() { Name = "Beta", AlphaAcidContent = 2.1, BetaAcidContent = 2.2 } }
			};

			//-- Setup the dbSet to be queried
			var mockSet = new Mock<DbSet<Hop>>();
			ConfigureAsQueryable(hopList.AsQueryable(), mockSet);

			var mockContext = new Mock<DatabaseConnector.Sqlite.SqliteDBContext>();
			mockContext.Setup(context => context.Hop).Returns(mockSet.Object);

			var hopController = new HopController(mockContext.Object, _logger.Object);

			var results = await hopController.Index();

			Assert.That(results, Has.Exactly(3).Items);
			Assert.That(results, Is.Ordered.By("Name"));
		}

		private static void ConfigureAsQueryable<TEntity>(IQueryable<TEntity> hopList, Mock<DbSet<TEntity>> mockSet) where TEntity : class
		{
			mockSet.As<IQueryable<TEntity>>().Setup(mock => mock.Provider).Returns(hopList.Provider);
			mockSet.As<IQueryable<TEntity>>().Setup(mock => mock.Expression).Returns(hopList.Expression);
			mockSet.As<IQueryable<TEntity>>().Setup(mock => mock.ElementType).Returns(hopList.ElementType);
			mockSet.As<IQueryable<TEntity>>().Setup(mock => mock.GetEnumerator()).Returns(hopList.GetEnumerator());
		}
	}
}