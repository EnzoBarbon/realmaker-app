# Deno backend with Prisma
FROM denoland/deno:alpine-2.1.4

WORKDIR /app

# Copy dependency files first (for better caching)
COPY deno.json deno.lock ./
COPY prisma ./prisma

# Install Prisma CLI and generate client
RUN deno install -A npm:prisma@latest && \
    deno task prisma:generate

# Copy source code
COPY src ./src

# Cache dependencies
RUN deno cache --reload src/mod.ts

# Expose port (Railway will override with $PORT)
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD deno eval "fetch('http://localhost:8000/health').catch(() => Deno.exit(1))"

# Start the server
CMD ["deno", "task", "start"]
