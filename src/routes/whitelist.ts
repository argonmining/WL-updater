import { Router, Request, Response } from 'express';
import { ofetch } from 'ofetch';
import { getTransaction } from '../services/kaspa';
import { updateWhitelist } from '../services/whitelist';

const router = Router();

// Types for our request and Kaspa API
interface UpdateWhitelistRequest {
  feeAmount: string;
  feeAddress: string;
  oldAddress: string;
  newAddress: string;
  whitelistID: string;
  txnID: string;
}

interface KaspaTransaction {
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

/**
 * Validates a Kaspa transaction for whitelist update
 * @param txnID - Transaction ID to validate
 * @param feeAmount - Expected fee amount in Sompi
 * @param feeAddress - Expected fee recipient address
 * @param oldAddress - Previous whitelist address
 * @returns boolean indicating if transaction is valid
 */
async function validateKaspaTransaction(
  txnID: string,
  feeAmount: string,
  feeAddress: string,
  oldAddress: string
): Promise<boolean> {
  try {
    // Fetch transaction details from Kaspa API
    const transaction = await getTransaction(txnID);

    // Validate transaction ID
    if (transaction.transaction_id !== txnID) {
      throw new Error('Transaction ID mismatch');
    }

    // Validate transaction is accepted
    if (!transaction.is_accepted) {
      throw new Error('Transaction is not accepted');
    }

    // Validate transaction time (24 hours = 86400000 milliseconds)
    const currentTime = Date.now();
    if (currentTime - transaction.block_time > 86400000) {
      throw new Error('Transaction is older than 24 hours');
    }

    // Validate old address exists in inputs
    const hasOldAddress = transaction.inputs.some(
      input => input.previous_outpoint_address === oldAddress
    );

    if (!hasOldAddress) {
      throw new Error('Old address not found in transaction inputs');
    }

    // Find and validate the fee output
    const feeOutput = transaction.outputs.find(
      output => output.script_public_key_address === feeAddress
    );

    if (!feeOutput) {
      throw new Error('Fee recipient address not found in transaction outputs');
    }

    // Validate fee amount (convert string to number for comparison)
    if (feeOutput.amount !== Number(feeAmount)) {
      throw new Error('Fee amount mismatch');
    }

    // Validate output transaction ID
    if (feeOutput.transaction_id !== txnID) {
      throw new Error('Output transaction ID mismatch');
    }

    return true;
  } catch (error) {
    console.error('Error validating Kaspa transaction:', error);
    return false;
  }
}

router.post('/update-whitelist', async (req: Request<{}, {}, UpdateWhitelistRequest>, res: Response) => {
  try {
    const { feeAmount, feeAddress, oldAddress, newAddress, whitelistID, txnID } = req.body;

    // Validate request body
    if (!feeAmount || !feeAddress || !oldAddress || !newAddress || !whitelistID || !txnID) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate the Kaspa transaction
    const isValid = await validateKaspaTransaction(txnID, feeAmount, feeAddress, oldAddress);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid transaction' });
    }

    // Update whitelist address using the service function
    const updateResult = await updateWhitelist(whitelistID, newAddress);

    res.json({ 
      success: true,
      result: updateResult 
    });

  } catch (error) {
    console.error('Error updating whitelist:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export const whitelistRouter = router; 