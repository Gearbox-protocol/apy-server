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
