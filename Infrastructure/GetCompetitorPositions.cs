using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using System.Collections.Generic;

namespace Infrastructure
{
    public static class GetCompetitorPositions
    {
        [FunctionName("GetCompetitorPositions")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous)] HttpRequest request,
            [CosmosDB(databaseName: "raceTracker",
            collectionName: "competitorPositions",
            ConnectionStringSetting = "AzureWebJobsCosmosDBConnectionString")] IEnumerable<object> competitorPositions)
        {
            return new OkObjectResult(competitorPositions);
        }
    }
}
