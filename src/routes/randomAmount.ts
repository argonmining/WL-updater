import { Router, Request, Response } from 'express';

const router = Router();

/**
 * Calculate a random Sompi amount based on the configured FEE_AMOUNT.
 * FEE_AMOUNT should be in KAS, but function returns Sompi.
 * Applies a random multiplier between 0.95 and 1.10 with 8 decimal precision
 * to prevent front-running.
 * 
 * @returns {bigint} Random amount in Sompi (1 KAS = 100,000,000 Sompi)
 */
function calculateRandomAmount(): bigint {
  try {
    // Convert KAS to Sompi (1 KAS = 100,000,000 Sompi)
    const baseAmountKAS = Number(process.env.FEE_AMOUNT);
    
    if (isNaN(baseAmountKAS) || baseAmountKAS <= 0) {
      throw new Error('Invalid FEE_AMOUNT configuration');
    }

    // Validate that input KAS amount doesn't exceed 8 decimal places
    if (!Number.isInteger(baseAmountKAS * 1e8)) {
      throw new Error('FEE_AMOUNT cannot have more than 8 decimal places');
    }

    // Convert to BigInt after calculating Sompi
    const baseAmountSompi = BigInt(Math.floor(baseAmountKAS * 1e8));

    // Apply random multiplier between 0.95 and 1.10
    // We'll multiply by 1e8 to get 8 decimal places of precision
    const randomMultiplierInt = BigInt(Math.floor((Math.random() * (110_0000_0000 - 95_0000_0000) + 95_0000_0000)));
    
    // Calculate final amount in Sompi using integer math
    // Divide by 1e8 at the end to account for our multiplier scaling
    const finalAmount = (baseAmountSompi * randomMultiplierInt) / 100_0000_0000n;

    return finalAmount;
  } catch (error) {
    throw error;
  }
}

router.get('/get-fee', async (req: Request, res: Response) => {
  try {
    const randomAmountSompi = calculateRandomAmount();
    
    // Convert BigInt to string for JSON response
    // and calculate KAS amount with proper decimal places
    const amountInKAS = (Number(randomAmountSompi) / 1e8).toString();
    
    // Validate the KAS amount doesn't have more than 8 decimal places
    if (amountInKAS.includes('.') && amountInKAS.split('.')[1].length > 8) {
      throw new Error('KAS amount exceeds 8 decimal places');
    }

    // Validate FEE_WALLET exists
    if (!process.env.FEE_WALLET) {
      throw new Error('FEE_WALLET is not configured');
    }

    res.json({ 
      amount: randomAmountSompi.toString(),
      amountInKAS,
      feeWallet: process.env.FEE_WALLET
    });
  } catch (error) {
    console.error('Error calculating random amount:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export const randomAmountRouter = router; 