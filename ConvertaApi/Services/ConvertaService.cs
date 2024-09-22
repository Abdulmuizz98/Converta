using System;
using System.Text;
using System.Net.Http;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using ConvertaApi.Data;
using ConvertaApi.Models;

namespace ConvertaApi.Services;
public class ConvertaService
{
    private readonly ConvertaContext _context;
    private readonly HttpClient _httpClient;
    private const string META_API_VERSION = "19.0";

    public ConvertaService(ConvertaContext context)
    {
        _context = context;
        _httpClient = new HttpClient();
    }

    public async Task<List<T>> GetItems<T>() where T : class
    {
        DbSet<T> dbSet = _context.Set<T>();
        return await dbSet.ToListAsync();
    }

    public async Task<List<T>> GetItems<T>(Expression<Func<T, bool>> predicate) where T : class
    {
        DbSet<T> dbSet = _context.Set<T>();
        return await dbSet.Where(predicate).ToListAsync();
    }

    public async Task<T?> GetItem<T>(Expression<Func<T, bool>> predicate) where T : class
    {
        DbSet<T> dbSet = _context.Set<T>();
        return await dbSet.FirstOrDefaultAsync(predicate);
    }

    public async Task<T?> GetItem<T>(Guid id) where T : class
    {
        DbSet<T> dbSet = _context.Set<T>();
        return await dbSet.FindAsync(id)!;
    }
    public async Task<T?> GetItem<T>(string id) where T : class
    {
        DbSet<T> dbSet = _context.Set<T>();
        return await dbSet.FindAsync(id)!;
    }

    public async Task AddItem<T>(T item) where T : class
    {
        DbSet<T> dbSet = _context.Set<T>();
        dbSet.Add(item);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateItem<T>(T item) where T : class
    {
        DbSet<T> dbSet = _context.Set<T>();
        dbSet.Attach(item);
        _context.Entry(item).State = EntityState.Modified;
        await _context.SaveChangesAsync();
    }

    public async Task<bool> UpdateItemWithRetry<T>(T item, int retries) where T : class
    {
        bool saveFailed;
        int attempts = 0;

        do
        {
            saveFailed = false;
            attempts++;

            try
            {
                DbSet<T> dbSet = _context.Set<T>();
                dbSet.Attach(item);
                _context.Entry(item).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                saveFailed = true;

                // Handle the concurrency exception here, e.g., log or notify the user
                // You can wait for a while before retrying
                await Task.Delay(TimeSpan.FromSeconds(1)); // Wait for 1 second
            }
        } while (saveFailed && attempts < retries); // Retry up to 3 times

        return !saveFailed;
    }

    public async Task DeleteItem<T>(T item) where T : class
    {
        DbSet<T> dbSet = _context.Set<T>();
        dbSet.Remove(item);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> ItemExists<T>(Expression<Func<T, bool>> predicate) where T : class
    {
        DbSet<T> dbSet = _context.Set<T>();
        return await dbSet.AnyAsync(predicate);
    }

    public async Task<bool> SendMetaEventPayloadWithRetry (string payload, string pixelId, string accessToken, int retries)
    {
        // https://graph.facebook.com/{API_VERSION}/{DATASET_ID}/events?access_token={TOKEN}
        bool reqFailed ;
        int attempts = 0;

        Console.WriteLine($"Payload: {payload}");

        var url = $"https://graph.facebook.com/v{META_API_VERSION}/{pixelId}/events?access_token={accessToken}";
        var content = new StringContent(payload, Encoding.UTF8, "application/json");

        Console.WriteLine("\nGOT HERE!!!!!!!!!!!\n");
        do {
            reqFailed = false;
            attempts++;

            try
            {
                var response = await _httpClient.PostAsync(url, content);
                response.EnsureSuccessStatusCode();
                string responseString = await response.Content.ReadAsStringAsync();
                Console.WriteLine($"Response: {responseString}");
            }
            catch(HttpRequestException e)
            {
                reqFailed = true;
                Console.WriteLine($"HTTP request failed: Trials <{attempts}>: {e.Message}");
                await Task.Delay(TimeSpan.FromSeconds(1)); // Wait for 1 second
            }
        }
        while (reqFailed && attempts < retries);

        return !reqFailed;
    }
    
}
