import { ofetch } from 'ofetch';

export interface KaspaTransaction {
  transaction_id: string;
  block_time: number;
  is_accepted: boolean;
  inputs: Array<{
    transaction_id: string;
    previous_outpoint_address: string;
    previous_outpoint_amount: number;
  }>;
  outputs: Array<{
    transaction_id: string;
    amount: number;
    script_public_key_address: string;
  }>;
}

export async function getTransaction(txnID: string): Promise<KaspaTransaction> {
  return ofetch<KaspaTransaction>(
    `https://api.kaspa.org/transactions/${txnID}?inputs=true&outputs=true&resolve_previous_outpoints=light`
  );
} 