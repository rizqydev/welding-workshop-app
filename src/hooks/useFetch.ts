export function useFetch() {
  async function fetchApi<T>(url: string): Promise<T> {
    const res = await fetch(url)
    if (res.ok) {
      return res.json() as Promise<T>
    }
    throw new Error(res.statusText)
  }

  return { fetchApi }
}
