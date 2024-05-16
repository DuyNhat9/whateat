
using System.Net.Http.Headers;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.Net.Http.Headers;
using WhatsEatCrawler.Data;
using WhatsEatCrawler.Models;


namespace WhatsEatCrawler;
class Program
{
    private static HttpClient client;
    private static readonly whatseatContext context = new whatseatContext();
    private readonly IHttpClientFactory _httpClientFactory = new IHttpClientFactory();


    static async Task Main(string[] args)
    {
        var repositories = await ProcessRepositories();
        var recipe = await GetRecipesAsync();
        // foreach (var repo in repositories)
        //     Console.WriteLine(repo.Name);
        Console.WriteLine(recipe!.Name);
    }

    private static async Task<List<Repository>> ProcessRepositories()
    {
        client = new HttpClient();
        client.DefaultRequestHeaders.Accept.Clear();
        client.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/vnd.github.v3+json"));
        client.DefaultRequestHeaders.Add("User-Agent", ".NET Foundation Repository Reporter");

        var streamTask = client.GetStreamAsync("https://api.github.com/orgs/dotnet/repos");
        var repositories = await JsonSerializer.DeserializeAsync<List<Repository>>(await streamTask);
        return repositories;
    }

    private static async Task<Recipe?> GetRecipesAsync()
    {
        return await context.Recipes.FirstOrDefaultAsync();
    }

    private static async Task<List<long>> GetProductIds()
    {
        client.DefaultRequestHeaders.Accept.Clear();
        client.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/vnd.github.v3+json"));
        client.DefaultRequestHeaders.Add("User-Agent", ".NET Foundation Repository Reporter");

        var streamTask = client.GetStreamAsync("https://api.github.com/orgs/dotnet/repos");
        var repositories = await JsonSerializer.DeserializeAsync<List<Repository>>(await streamTask);
        return repositories;
    }
}