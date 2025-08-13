#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT"

echo "🔻 Stopping dev servers..."
pkill -f "node src/server.js" >/dev/null 2>&1 || true
pkill -f "nodemon .*src/server.js" >/dev/null 2>&1 || true
pkill -f "vite" >/dev/null 2>&1 || true

echo "🔻 Stopping containers..."
docker compose down >/dev/null 2>&1 || true

echo "🔹 Starting Postgres..."
docker compose up -d db

echo "⏳ Waiting for Postgres to be healthy..."
for i in {1..30}; do
  status="$(docker inspect -f '{{.State.Health.Status}}' capstone-postgres 2>/dev/null || echo starting)"
  if [ "$status" = "healthy" ]; then
    echo "✅ Postgres healthy"
    break
  fi
  sleep 1
  if [ "$i" -eq 30 ]; then
    echo "❌ Postgres failed to become healthy"
    docker compose logs db
    exit 1
  fi
done

echo "🚀 Starting backend..."
pushd backend >/dev/null
# ensure an env file exists (your .env already set up)
[ -f ".env" ] || cp .env.example .env 2>/dev/null || true
nohup node src/server.js > /tmp/backend.log 2>&1 &
API_PID=$!
popd >/dev/null

echo "⏳ Waiting for API on http://localhost:3000..."
for i in {1..30}; do
  if curl -sSf http://localhost:3000/health >/dev/null 2>&1; then
    echo "✅ API is up"
    break
  fi
  sleep 1
  if [ "$i" -eq 30 ]; then
    echo "❌ API failed to start. Last 50 log lines:"
    tail -n 50 /tmp/backend.log || true
    exit 1
  fi
done

echo "🔎 Running checks..."
HEALTH="$(curl -s http://localhost:3000/health)"
DBPING="$(curl -s http://localhost:3000/api/v1/db-ping)"
ITEMS="$(curl -s http://localhost:3000/api/v1/items)"

echo "----------------------------------------"
echo "Health   : $HEALTH"
echo "DB Ping  : $DBPING"
echo "Items    : $ITEMS"
echo "Backend PID: $API_PID"
echo "Logs: /tmp/backend.log  (tail -f /tmp/backend.log)"
echo "----------------------------------------"
