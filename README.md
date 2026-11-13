# Vercel deployment

1. Upload this folder to a GitHub repository.
2. Import the repository into Vercel and deploy.
3. In Vercel → Project → Settings → Environment Variables, optionally set:
   - `API_KEY` (defaults to `TITAN`)
   - `UPSTREAM_API_KEY` (defaults to `ftgamer`)
   - `UPSTREAM_API_URL` (defaults to the URL in `api/index.js`)
4. Redeploy after changing environment variables.

Endpoints:
- `GET /` — status
- `GET /tg?key=YOUR_API_KEY&info=USERNAME` — proxy request
- `GET /tg?key=YOUR_API_KEY&id=TELEGRAM_ID` — `id` is also accepted

The uploaded server.js contained a broken attribution-replacement block. This package repairs it and exports Express as a Vercel serverless function (without `app.listen()`).
