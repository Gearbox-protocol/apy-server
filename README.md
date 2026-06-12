# apy-server

for fetching the apy of different asset on diferrent protocols. For protocols Like for curve, lido, sky, pendle, defillama etc.

## Developing

Run `yarn start` to launch app. It will save output to `output.json` file by default. See [config](./src/core/config.ts) for env variables.

For Merkl API integration, set `MERKL_API_KEY` environment variable. Anonymous requests are limited to 10 req/sec; a key removes this limit and enables attribution.

In GitHub Actions releases the secret is expected to be named `MERKL_API_KEY_BACK` and is mapped to `MERKL_API_KEY` for the application.

## Running as docker

```
docker run --rm \
  -e OUTPUT_JSON=/output/output.json \
  -v "$(pwd)/tmp:/output" \
  ghcr.io/gearbox-protocol/apy-server
```

### History

Historically, this was a backend API deployed on fly.io and providing several endpoints:

- `/api/rewards/gear-apy`
- `/api/rewards/pools/all`
- `/api/rewards/tokens/all`

Currently, this mode is still supported, but we're transitioning to one-shot mode, that runs on schedule, and dumps all results into file that is served via CDN later
