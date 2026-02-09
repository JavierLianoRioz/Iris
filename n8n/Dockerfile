FROM n8nio/n8n:2.7.3

USER root

RUN mkdir -p /home/node/custom-nodes && \
    cd /home/node/custom-nodes && \
    npm install n8n-nodes-evolution-api --ignore-scripts && \
    chown -R node:node /home/node/custom-nodes

USER node

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:5678/healthz || exit 1