using System.Text.Json;

namespace API.Practice
{
    public static class ExtensionHttp
    {
        public static void PaginationHeaders(this HttpResponse response, MetaData metadata) {

            var json = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            response.Headers.Append("Pagination", JsonSerializer.Serialize(metadata, json));
            response.Headers.Append("Access-Control-Expose-Headers", "Pagination");
        }  
    }
}
