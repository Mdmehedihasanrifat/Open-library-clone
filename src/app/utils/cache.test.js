const { cacheData, clearCache } = require('./cache.js'); // Use CommonJS require

describe('cacheData', () => {
  const mockFetchFunction = jest.fn();
  const expirationTime = 6000; 

  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
    clearCache(); // Clear the cache before each test
    jest.useFakeTimers(); // Use fake timers
  });

  it('should fetch new data when cache is empty', async () => {
    mockFetchFunction.mockResolvedValue('new data');

    const data = await cacheData('key1', mockFetchFunction, expirationTime);

    expect(data).toBe('new data');
    expect(mockFetchFunction).toHaveBeenCalledTimes(1);
  });

  it('should return cached data if not expired', async () => {
    mockFetchFunction.mockResolvedValue('new data');

    // First call to cacheData
    await cacheData('key1', mockFetchFunction, expirationTime);
    
    // Immediately call again to check for cache usage
    const data = await cacheData('key1', mockFetchFunction, expirationTime);

    expect(data).toBe('new data');
    expect(mockFetchFunction).toHaveBeenCalledTimes(1); // Should not call again
  });

  it('should fetch new data after expiration', async () => {
    mockFetchFunction.mockResolvedValue('new data');

    // First call to cacheData
    await cacheData('key1', mockFetchFunction, expirationTime);

    // Wait for expiration
    jest.advanceTimersByTime(expirationTime + 1); // Move forward time

    const data = await cacheData('key1', mockFetchFunction, expirationTime);

    expect(data).toBe('new data');
    expect(mockFetchFunction).toHaveBeenCalledTimes(2); // Should call again for new data
  });

  it('should handle errors during fetching', async () => {
    mockFetchFunction.mockRejectedValue(new Error('Fetch failed'));

    await expect(cacheData('key1', mockFetchFunction, expirationTime)).rejects.toThrow('Fetch failed');
    expect(mockFetchFunction).toHaveBeenCalledTimes(1); // Should call once
  });


});
