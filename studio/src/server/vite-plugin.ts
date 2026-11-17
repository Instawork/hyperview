import type { Plugin, ViteDevServer } from 'vite';
import { WebSocketServer, WebSocket } from 'ws';

let currentHxml = '';
let wss: WebSocketServer | null = null;

export function hxmlPreviewPlugin(): Plugin {
  return {
    name: 'hyperview-studio-preview',

    configureServer(server: ViteDevServer) {
      wss = new WebSocketServer({ noServer: true });

      server.httpServer?.on('upgrade', (request, socket, head) => {
        if (request.url === '/preview/ws') {
          wss!.handleUpgrade(request, socket, head, (ws) => {
            wss!.emit('connection', ws, request);
          });
        }
      });

      wss.on('connection', (ws) => {
        console.log('[HV Studio] Preview client connected');
        ws.on('close', () => {
          console.log('[HV Studio] Preview client disconnected');
        });
      });

      server.middlewares.use('/preview/update', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method not allowed');
          return;
        }

        let body = '';
        req.on('data', (chunk: Buffer) => { body += chunk.toString(); });
        req.on('end', () => {
          currentHxml = body;

          if (wss) {
            wss.clients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ type: 'reload' }));
              }
            });
          }

          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.end(JSON.stringify({ ok: true }));
        });
      });

      server.middlewares.use('/preview/screen.xml', (_req, res) => {
        res.setHeader('Content-Type', 'application/xml');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(currentHxml || defaultHxml());
        return;
      });

      server.middlewares.use('/preview/clients', (_req, res) => {
        const count = wss ? [...wss.clients].filter((c) => c.readyState === WebSocket.OPEN).length : 0;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(JSON.stringify({ count }));
      });

      console.log('[HV Studio] Preview server ready at /preview/*');
    },
  };
}

function defaultHxml(): string {
  return `<doc xmlns="https://hyperview.org/hyperview">
  <screen>
    <body>
      <view>
        <text>No content yet. Build something in the editor!</text>
      </view>
    </body>
  </screen>
</doc>`;
}
