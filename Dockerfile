FROM node:24.11 AS dev

ENV YARN_CACHE_FOLDER=/root/.yarn

ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_PROJECT

ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
ENV SENTRY_ORG=${SENTRY_ORG}
ENV SENTRY_PROJECT=${SENTRY_PROJECT}

WORKDIR /app

COPY . .

RUN --mount=type=cache,id=yarn,target=/root/.yarn \
    corepack enable \
    && yarn install --immutable \
    && yarn build

# Production npm modules

FROM node:24.11 AS prod

ENV YARN_CACHE_FOLDER=/root/.yarn

WORKDIR /app

COPY --from=dev /app/package.json /app/yarn.lock /app/.yarnrc.yml /app/
COPY --from=dev /app/build/ /app/build

RUN --mount=type=cache,id=yarn,target=/root/.yarn \
    corepack enable \
    && yarn workspaces focus --all --production

# Final image

FROM gcr.io/distroless/nodejs24-debian12
ARG PACKAGE_VERSION
ENV PACKAGE_VERSION=${PACKAGE_VERSION:-0.0.0}
LABEL org.opencontainers.image.version="${PACKAGE_VERSION}"

WORKDIR /app
COPY --from=prod /app /app
CMD ["--enable-source-maps", "/app/build/index.mjs"]
