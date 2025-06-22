const http = require('http');
const os = require('os');

// メトリクスの追跡
let requestCount = 0;
const startTime = Date.now();

const server = http.createServer((req, res) => {
  requestCount++;

  if (req.url === '/metrics') {
    // メトリクスページの表示
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    const memoryUsage = process.memoryUsage();
    const freeMemory = os.freemem();
    const totalMemory = os.totalmem();

    const metrics = {
      server: {
        uptime: `${uptime} 秒`,
        requestCount: requestCount,
        startTime: new Date(startTime).toISOString()
      },
      system: {
        hostname: os.hostname(),
        platform: os.platform(),
        cpus: os.cpus().length,
        arch: os.arch(),
        memory: {
          free: `${Math.round(freeMemory / 1024 / 1024)} MB`,
          total: `${Math.round(totalMemory / 1024 / 1024)} MB`,
          usage: `${Math.round((totalMemory - freeMemory) / totalMemory * 100)}%`
        },
        process: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)} MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)} MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)} MB`
        }
      }
    };

    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(metrics, null, 2));
  } else {
    // 通常のウェルカムページ
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(`
      <html>
        <head>
          <meta charset="utf-8">
          <title>Node.js サーバー</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
            h1 { color: #333; }
            .info { background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 20px; }
            a { color: #0066cc; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <h1>Node.js サーバーが起動しています</h1>
          <p>これはDockerコンテナ内で実行されているNode.jsサーバーです。</p>
          <div class="info">
            <p>サーバー起動時間: ${new Date(startTime).toLocaleString()}</p>
            <p>リクエスト数: ${requestCount}</p>
            <p><a href="/metrics">詳細なメトリクスを表示する</a></p>
          </div>
        </body>
      </html>
    `);
  }
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Server running at http://localhost:3000');
  console.log('For Docker, access via http://localhost:3000 from your host machine');
  console.log('Metrics available at http://localhost:3000/metrics');
});
