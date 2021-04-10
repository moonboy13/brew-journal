using NUnit.Framework;
using Bunit;
using BrewJournal.Client.Pages;
using ClientUnitTests.Properties;
using RichardSzalay.MockHttp;
using Models;
using System.Collections.Generic;
using Blazored.Toast.Services;
using Moq;
using Microsoft.Extensions.DependencyInjection;
using UserProp = BrewJournal.Client.Properties.UserResources;

namespace ClientUnitTests
{
	public class EditHopTests : Bunit.TestContext
	{
		Bunit.TestContext _ctx;
		MockHttpMessageHandler _mockHttp;

		[SetUp]
		public void Setup()
		{
			_ctx = new Bunit.TestContext();
			_mockHttp = _ctx.Services.AddMockHttpClient();
			var mockToast = new Mock<IToastService>();
			_ctx.Services.AddSingleton(mockToast.Object);
		}

		[TearDown]
		public void TearDown()
		{
			_mockHttp.Clear();
		}


		[Test]
		public void HopPage_NoHopIdProvided_LoadDefaultHop()
		{
			_mockHttp.When("/Hop").RespondSuccessJson(new List<Hop>());

			//-- Render the page with no parameters
			var page = _ctx.RenderComponent<EditHop>();

			//-- Assert that the component initialized as expected
			Assert.AreEqual(0, page.Instance.Id, Resources.EditHopDefaultIDCheckFailed);
			var noHopsFoundMessage = page.Find("p");
			noHopsFoundMessage.MarkupMatches($"<p>{string.Format(UserProp.NoRecordMatchesFilter, nameof(Hop))}</p>", Resources.EditHopDefaultHeaderCheckFailed);
		}
	}
}