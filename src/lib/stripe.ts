export async function createCheckoutSession(photoId: string): Promise<string> {
  const { data, error } = await fetch('/api/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ photoId }),
  }).then(async (r) => {
    const json = await r.json()
    return { data: json, error: r.ok ? null : new Error(json.message) }
  })

  if (error) throw error
  return data.url
}
