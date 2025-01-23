import { ofetch } from 'ofetch';

export async function updateWhitelist(whitelistID: string, newAddress: string): Promise<any> {
  if (!process.env.WHITELIST_API_URL) {
    throw new Error('WHITELIST_API_URL is not configured');
  }

  if (!process.env.WHITELIST_API_USERNAME || !process.env.WHITELIST_API_PASSWORD) {
    throw new Error('Whitelist API credentials are not configured');
  }

  // Create base64 encoded auth string
  const auth = Buffer.from(
    `${process.env.WHITELIST_API_USERNAME}:${process.env.WHITELIST_API_PASSWORD}`
  ).toString('base64');

  return ofetch(`${process.env.WHITELIST_API_URL}/${whitelistID}`, {
    method: 'POST',
    body: { address: newAddress },
    headers: {
      'Authorization': `Basic ${auth}`
    }
  });
} 