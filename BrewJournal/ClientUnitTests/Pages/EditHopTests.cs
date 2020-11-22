using NUnit.Framework;
using Bunit;
using BrewJournal.Client.Pages;
using ClientUnitTests.Properties;

namespace ClientUnitTests
{
	public class EditHopTests : Bunit.TestContext
	{
		[SetUp]
		public void Setup()
		{
		}

		[Test]
		public void PageShouldLoadDefaultHopWhenNoIdIsProvided()
		{
			//-- Render the page with no parameters
			var page = RenderComponent<EditHop>();

			//-- Assert that the component initialized as expected
			Assert.AreEqual(0, page.Instance.Id, Resources.EditHopDefaultIDCheckFailed);
			var header = page.Find("h1");
			header.MarkupMatches("<h1>Add Hop</h1>", Resources.EditHopDefaultHeaderCheckFailed);
		}
	}
}