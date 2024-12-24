FROM node:20.14 as dev

ENV YARN_CACHE_FOLDER=/root/.yarn

WORKDIR /app

COPY . .

RUN --mount=type=cache,id=yarn,target=/root/.yarn \
 yarn install --frozen-lockfile --ignore-engines \
 && yarn build

# Production npm modules

FROM node:20.14 as prod

ENV YARN_CACHE_FOLDER=/root/.yarn

WORKDIR /app

COPY --from=dev /app/package.json /app
COPY --from=dev /app/build/ /app/build

RUN --mount=type=cache,id=yarn,target=/root/.yarn \
    yarn install --production --frozen-lockfile --ignore-engines


# Final image

FROM gcr.io/distroless/nodejs20-debian12

WORKDIR /app
COPY --from=dev /app /app
CMD ["--enable-source-maps", "/app/build/main.mjs"]
