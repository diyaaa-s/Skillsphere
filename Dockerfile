# ===== Stage 1: Build =====
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# ===== Stage 2: Production =====
FROM node:18-alpine AS production

# Set NODE_ENV
ENV NODE_ENV=production

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S skillsphere -u 1001

WORKDIR /app

# Copy dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application code
COPY --chown=skillsphere:nodejs . .

# Switch to non-root user
USER skillsphere

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

# Start command
CMD ["node", "backend/server.js"]
