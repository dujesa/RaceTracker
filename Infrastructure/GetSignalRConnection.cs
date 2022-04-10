using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using Microsoft.Extensions.Logging;

namespace Infrastructure
{
    public static class GetSignalRConnection
    {
        [FunctionName("GetSignalRConnection")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous)] HttpRequest request,
            [SignalRConnectionInfo(HubName = "raceTrackerHub")] SignalRConnectionInfo connectionInfo,
            ILogger logger)
        {
            logger.LogInformation($"{connectionInfo.AccessToken} - {request?.HttpContext?.Connection?.Id}");

            return new OkObjectResult(connectionInfo);
        }
    }
}
