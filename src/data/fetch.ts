//try actual api endpoint, fallback to mock data if fail
//look at console logs for more info
export async function fetchWithFallback<T>(
  url: string,
  fallbackData: T,
  init?: RequestInit,
): Promise<T> {
  try {
    const response = await fetch(url, init);

    //basic check for 200 status
    //any site you can visit in web browser will bypass this
    if (!response.ok) {
      console.log("Fetch not ok, using fallback:", response.status);
      return fallbackData;
    }

    const data = (await response.json()) as T;
    return data;
  } catch (error) {
    console.error("Fetch error, using fallback:", error);
    return fallbackData;
  }
}
