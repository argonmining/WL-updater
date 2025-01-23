import 'dotenv/config';
import { createServer } from './server';

const PORT = process.env.PORT || 7713;

const server = createServer();

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 