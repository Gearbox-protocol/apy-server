FROM node:24.22.1 AS dev

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_PROJECT

ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}
ENV SENTRY_ORG=${SENTRY_ORG}
ENV SENTRY_PROJECT=${SENTRY_PROJECT}

WORKDIR /app

COPY . .

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile \
    && pnpm build

# Production npm modules

FROM node:24.22.1 AS prod

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

COPY --from=dev /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/
COPY --from=dev /app/build/ /app/build

RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    npm pkg delete scripts.prepare \
    && pnpm install --prod --frozen-lockfile

# Final image

FROM gcr.io/distroless/nodejs24-debian13@sha256:c23cc7262662efd642cd9c9d61783d10f600321f7bafdd37c8a82365ffaa2aa6
ARG PACKAGE_VERSION
ENV PACKAGE_VERSION=${PACKAGE_VERSION:-0.0.0}
ENV NODE_ENV=production
LABEL org.opencontainers.image.version="${PACKAGE_VERSION}"

WORKDIR /app
COPY --from=prod /app /app
CMD ["--enable-source-maps", "/app/build/index.mjs"]
