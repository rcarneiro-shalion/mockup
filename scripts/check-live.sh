#!/usr/bin/env bash
# Simulate the live-data proxy connection from the CLI — same dual-header auth the
# app uses (Authorization: Bearer <access> + x-id-token: <id>) against a Shalion API.
#
# Usage:
#   export AUTH_TOKEN="eyJ..."     # bearer access token
#   export X_ID_TOKEN="eyJ..."     # x-id-token
#   ./scripts/check-live.sh                                   # default: visualization · prod · /v1.0/admin/dashboardapplications
#   ./scripts/check-live.sh iam prod /v1.0/admin/applications
#   ./scripts/check-live.sh orders-management prod /v1.0/admin/orders
#
# Args: [service] [env: develop|staging|prod] [path]
set -euo pipefail

SERVICE="${1:-visualization}"
ENVN="${2:-prod}"
APIPATH="${3:-/v1.0/admin/dashboardapplications}"

# service key -> API slug (matches src/lib/api/shalion.server.ts)
case "$SERVICE" in
  iam) SLUG="iam-api" ;;
  backoffice) SLUG="backoffice-api" ;;
  codification) SLUG="codification-api" ;;
  ecometry-tasks) SLUG="ecometry-tasks-api" ;;
  product) SLUG="product-api" ;;
  bulk) SLUG="bulk-api" ;;
  seeds-api) SLUG="seeds-api" ;;
  visualization) SLUG="visualization-api" ;;
  snowflake) SLUG="snowflake-api" ;;
  orders-management) SLUG="orders-management-api" ;;
  data-collector-instructions) SLUG="data-collector-instructions-api" ;;
  data-collector-extractions) SLUG="data-extraction-api" ;;
  data-collector-proxies) SLUG="data-collector-proxies-api" ;;
  maestro) SLUG="maestro-api" ;;
  *) echo "Unknown service '$SERVICE'"; exit 1 ;;
esac

case "$ENVN" in
  develop) SUFFIX="-develop.develop.shalion.com" ;;   # internal — needs VPN
  staging) SUFFIX="-staging.ondemand.shalion.com" ;;  # internal — needs VPN
  prod)    SUFFIX="-prod.v2.shalion.com" ;;           # public
  *) echo "env must be develop | staging | prod"; exit 1 ;;
esac

BASE="https://${SLUG}${SUFFIX}"
echo "→ ${SERVICE} (${ENVN}): ${BASE}"

echo "1) reachability — GET /actuator/health (no auth):"
curl -sS -m 10 -o /dev/null -w "   HTTP %{http_code}\n" "${BASE}/actuator/health" \
  || echo "   ✗ UNREACHABLE — host can't be reached (DNS/VPN/firewall)."

echo "2) authed — GET ${APIPATH}:"
curl -sS -m 20 -w "\n   → HTTP %{http_code}\n" \
  -H "Authorization: Bearer ${AUTH_TOKEN:?set AUTH_TOKEN}" \
  -H "x-id-token: ${X_ID_TOKEN:?set X_ID_TOKEN}" \
  -H "accept: application/json" \
  "${BASE}${APIPATH}" | head -c 900
echo
echo "   (200 = OK · 401/403 = token missing/expired · 000/UNREACHABLE = network/VPN)"
