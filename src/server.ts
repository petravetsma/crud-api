import { createServer, IncomingMessage, Server, ServerResponse } from 'http';
import { router } from './router';

export const server = createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    await router(req, res);
  },
);

export const startServer = (port: number): Server => {
  return server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};
