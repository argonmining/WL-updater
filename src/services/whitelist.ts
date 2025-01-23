import { ofetch } from 'ofetch';

export async function updateWhitelist(whitelistID: string, newAddress: string): Promise<any> {
  if (!process.env.WHITELIST_API_URL) {
    throw new Error('WHITELIST_API_URL is not configured');
  }

  return ofetch(`${process.env.WHITELIST_API_URL}/${whitelistID}`, {
    method: 'POST',
    body: { address: newAddress }
  });
} 