using Bunit;
using Microsoft.Extensions.DependencyInjection;
using RichardSzalay.MockHttp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace ClientUnitTests
{
	/// <summary>
	/// Helper extension class to configure the HttpClient mock utilizing Richard Szalay's package.
	/// </summary>
	public static class MockHttpClientHelper
	{
		/// <summary>
		/// Bunit.TestServiceProvider extension method. Instantiates and registers the MockHttpClient handler.
		/// </summary>
		/// <param name="services">The current test context</param>
		public static MockHttpMessageHandler AddMockHttpClient(this TestServiceProvider services)
		{
			var mockHttpHandler = new MockHttpMessageHandler();
			var httpClient = mockHttpHandler.ToHttpClient();
			httpClient.BaseAddress = new Uri("http://localhost");
			services.AddSingleton(httpClient);
			return mockHttpHandler;
		}

		/// <summary>
		/// Configures a 200 response to a mocked request by serializing the provided data object.
		/// </summary>
		/// <typeparam name="T">Data type of the provded content</typeparam>
		/// <param name="request">The mock request object</param>
		/// <param name="content"></param>
		/// <returns></returns>
		public static MockedRequest RespondSuccessJson<T>(this MockedRequest request, T content)
		{
			request.Respond(req =>
			{
				var response = new HttpResponseMessage(HttpStatusCode.OK);
				response.Content = new StringContent(JsonSerializer.Serialize(content));
				response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
				return response;
			});
			return request;
		}

		/// <summary>
		/// Configures a 200 response to a mocked request by calling the provided function and serializing
		/// the output.
		/// </summary>
		/// <typeparam name="T">Return type of the provided function</typeparam>
		/// <param name="request">Mock request object</param>
		/// <param name="contentProvider">Delegate function to call to provide request results</param>
		/// <returns></returns>
		public static MockedRequest RespondSuccessJson<T>(this MockedRequest request, Func<T> contentProvider)
		{
			request.Respond(req =>
			{
				var response = new HttpResponseMessage(HttpStatusCode.OK);
				response.Content = new StringContent(JsonSerializer.Serialize(contentProvider()));
				response.Content.Headers.ContentType = new MediaTypeHeaderValue("application/json");
				return response;
			});
			return request;
		}
	}
}
