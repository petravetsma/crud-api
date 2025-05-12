import { startServer } from './server';
import 'dotenv/config';

const port = Number(process.env.PORT || 3000);

startServer(port);
