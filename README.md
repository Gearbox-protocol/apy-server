# apy-server

for fetching the apy of different asset on diferrent protocols. For protocols Like for curve, lido, sky, pendle, defillama etc.

## Running as docker

```
docker run --rm \
  -e ONE_SHOT=true \
  -e OUTPUT_JSON=/output/output.json \
  -v "$(pwd)/tmp:/output" \
  ghcr.io/gearbox-protocol/apy-server:1.1.0-static.1
```

### History

Historically, this was a backend API deployed on fly.io and providing several endpoints:

- `/api/rewards/gear-apy`
- `/api/rewards/pools/all`
- `/api/rewards/tokens/all`

Currently, this mode is still supported, but we're transitioning to one-shot mode, that runs on schedule, and dumps all results into file that is served via CDN later
