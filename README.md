# Start

- 修改 `.env` 文件中的变量
  - `END_POINT`：请求代理
- 创建 `.env.local` 文件，并添加变量
  - `OPENAI_API_KEY`：OpenAI 的鉴权 Key

```shell
# Install dependencies
npm install
# Start service
npm run dev
```

启动后访问 `http://localhost:3000/`

# Cloudflare worker

```
async function handleRequest(request) {
  const url = new URL(request.url);
  url.host = "api.openai.com";
  return fetch(url, {
    headers: request.headers,
    method: request.method,
    body: request.body,
  });
}
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});
```
