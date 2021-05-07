using NUnit.Framework;
using BrewJournal.Server.Controllers;
using System;
using System.Collections.Generic;
using System.Text;
using DatabaseConnector.Sqlite;
using Models;
using Moq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System.Linq;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace BrewJournal.Server.Controllers.Tests
{
	[TestFixture()]
	public class HopControllerTests
	{
		Mock<ILogger<HopController>> _logger;
		Mock<SqliteDBContext> _mockContext;

		[SetUp]
		public void Setup()
		{
			_logger = new Mock<ILogger<HopController>>();
			_mockContext = new Mock<SqliteDBContext>();
		}

		[Test()]
		public async Task Create_ValidData_SuccessfulCreate()
		{
			//-- Setup all our needed mocked objects. The context and logger probably
			//-- can probably be move up to a class Setup function
			var mockHopDBet = new Mock<DbSet<Hop>>();
			_mockContext.Setup(context => context.Hop).Returns(mockHopDBet.Object);
			_mockContext.Setup(context => context.SaveAsync()).ReturnsAsync(1);

			var hopController = new HopController(_mockContext.Object, _logger.Object);
			var hop = new Hop()
			{
				Name = "foo",
				AlphaAcidContent = 5.5,
				BetaAcidContent = 1.0,
				Id = 0
			};

			var result = await hopController.Create(hop);

			_mockContext.Verify(m => m.Add(It.IsAny<Hop>()), Times.Once());
			_mockContext.Verify(m => m.SaveAsync(), Times.Once());
		}

		[Test()]
		public void Create_InvalidData_HopAlphaAcidOutOfRange_FailValidation()
		{
			var hop = new Hop()
			{
				Name = "foo",
				AlphaAcidContent = 99.0,
				BetaAcidContent = 1.0
			};
			string expectedMessage = string.Format(Models.Properties.Resources.RangeErrorMsg, nameof(hop.AlphaAcidContent), 0.0, 50.0);

			RunValidationAsserts(hop, expectedMessage, nameof(hop.AlphaAcidContent));
		}

		[Test()]
		public void Create_InvalidData_HopBetaAcidOutOfRange_FailValidation()
		{
			var hop = new Hop()
			{
				Name = "foo",
				AlphaAcidContent = 1.0,
				BetaAcidContent = 99.0
			};
			string expectedMessage = string.Format(Models.Properties.Resources.RangeErrorMsg, nameof(hop.BetaAcidContent), 0.0, 50.0);

			RunValidationAsserts(hop, expectedMessage, nameof(hop.BetaAcidContent));
		}

		[Test()]
		public void Create_InvalidData_NameMissing_FailValidation()
		{
			var hop = new Hop()
			{
				AlphaAcidContent = 1.0,
			};
			string expectedMessage = string.Format(Models.Properties.Resources.RequiredErrorMsg, nameof(hop.Name));

			RunValidationAsserts(hop, expectedMessage, nameof(hop.Name));
		}

		[Test()]
		public async Task Delete_ValidId_DeleteSuccessful()
		{
			Mock<DbSet<Hop>> mockSet = GenerateMockHopQuerySet();
			_mockContext.Setup(m => m.DeleteAsync(It.IsAny<Hop>())).ReturnsAsync(1);
			//-- Delete the first element from the query set. An exception throw is appropriate
			//-- here if there are no elements in the list;
			Hop hopToDelete = mockSet.Object.First();

			var hopController = new HopController(_mockContext.Object, _logger.Object);

			IActionResult result = await hopController.Delete(hopToDelete.Id);

			Assert.That(result, Is.TypeOf(typeof(OkResult)));
			_mockContext.Verify(m => m.DeleteAsync(It.IsAny<Hop>()), Times.Once());
		}

		[Test()]
		public async Task Index_GetHopsInNameOrder()
		{
			_ = GenerateMockHopQuerySet();

			var hopController = new HopController(_mockContext.Object, _logger.Object);

			var results = await hopController.Index();

			Assert.That(results, Has.Exactly(3).Items);
			Assert.That(results, Is.Ordered.By("Name"));
		}

		private Mock<DbSet<Hop>> GenerateMockHopQuerySet()
		{
			var hopList =  new List<Hop>()
			{
				{ new Hop() { Id = 1, Name = "Alpha", AlphaAcidContent = 1.1, BetaAcidContent = 1.2 } },
				{ new Hop() { Id = 2, Name = "Gamma", AlphaAcidContent = 3.1, BetaAcidContent = 3.2 } },
				{ new Hop() { Id = 3, Name = "Beta", AlphaAcidContent = 2.1, BetaAcidContent = 2.2 } }
			};

			//-- Setup the dbSet to be queried
			var mockSet = new Mock<DbSet<Hop>>();
			ConfigureAsQueryable(hopList.AsQueryable(), mockSet);

			_mockContext.Setup(context => context.Hop).Returns(mockSet.Object);

			return mockSet;
		}

		private void ConfigureAsQueryable<TEntity>(IQueryable<TEntity> hopList, Mock<DbSet<TEntity>> mockSet) where TEntity : class
		{
			mockSet.As<IQueryable<TEntity>>().Setup(mock => mock.Provider).Returns(hopList.Provider);
			mockSet.As<IQueryable<TEntity>>().Setup(mock => mock.Expression).Returns(hopList.Expression);
			mockSet.As<IQueryable<TEntity>>().Setup(mock => mock.ElementType).Returns(hopList.ElementType);
			mockSet.As<IQueryable<TEntity>>().Setup(mock => mock.GetEnumerator()).Returns(hopList.GetEnumerator());
		}

		private void RunValidationAsserts(Hop hop, string expectedMessage, string field)
		{
			List<ValidationResult> validations = new();
			Assert.That(Validator.TryValidateObject(hop, new ValidationContext(hop), validations, true), Is.False);
			Assert.That(validations, Has.Exactly(1).Items);
			Assert.That(validations[0].MemberNames, Contains.Item(field));
			Assert.That(validations[0].ErrorMessage, Is.Not.Null.And.Contains(expectedMessage).IgnoreCase);
		}
	}
}