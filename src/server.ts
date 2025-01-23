import express from 'express';
import { randomAmountRouter } from './routes/randomAmount';
import { whitelistRouter } from './routes/whitelist';

export function createServer() {
  const app = express();
  
  app.use(express.json());
  
  // Routes
  app.use('/api', randomAmountRouter);
  app.use('/api', whitelistRouter);

  // Debug: Log all registered routes
  app._router.stack.forEach((r: any) => {
    if (r.route && r.route.path) {
      console.log(`${Object.keys(r.route.methods)} ${r.route.path}`);
    }
  });
  
  return app;
} 