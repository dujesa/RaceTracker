using Microsoft.Azure.Documents;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Infrastructure
{
    public static class OnPositionsChanged
    {
        [FunctionName("OnPositionsChanged")]
        public static async Task Run(
            [CosmosDBTrigger(databaseName: "raceTracker",
                collectionName: "competitorPositions",
                CreateLeaseCollectionIfNotExists = true,
                LeaseCollectionName = "lease",
                ConnectionStringSetting = "AzureWebJobsCosmosDBConnectionString")] IReadOnlyList<Document> updatedPositions,
            [SignalR(HubName = "raceTrackerHub")] IAsyncCollector<SignalRMessage> raceTrackerMessages,
            ILogger log)
        {
            foreach (var position in updatedPositions)
            {
                await raceTrackerMessages.AddAsync(new SignalRMessage
                {
                    Target = "updatePositions",
                    Arguments = new[] { position }
                });

                if (updatedPositions != null && updatedPositions.Count > 0)
                {
                    log.LogInformation("Documents modified " + updatedPositions.Count);
                }
            }
        }
    }
}
