#!/bin/bash
# Test extension submission with dry-run
# Usage: ./scripts/test-submission.sh [--chrome|--firefox|--both]
# Credentials are loaded from .env.submit

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Gmail Alias Toolkit - Submission Test${NC}"
echo ""

# Step 1: Check environment
echo "1️⃣  Checking environment..."
if [ ! -f ".env.submit" ]; then
  echo -e "${RED}✗ .env.submit not found${NC}"
  exit 1
fi
echo -e "${GREEN}✓ .env.submit found${NC}"

if ! command -v yarn &> /dev/null; then
  echo -e "${RED}✗ Yarn not found${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Yarn found${NC}"

# Load credentials from .env.submit
set -a
source .env.submit
set +a
echo -e "${GREEN}✓ Credentials loaded${NC}"

# Step 2: Build
echo ""
echo "2️⃣  Building extension..."
yarn build > /dev/null 2>&1 && echo -e "${GREEN}✓ Build successful${NC}" || {
  echo -e "${RED}✗ Build failed${NC}"
  exit 1
}

# Step 3: Create zip
echo ""
echo "3️⃣  Creating Chrome zip package..."
yarn zip > /dev/null 2>&1 && echo -e "${GREEN}✓ Zip created${NC}" || {
  echo -e "${RED}✗ Zip creation failed${NC}"
  exit 1
}

# Step 4: List created files
echo ""
echo "4️⃣  Created packages:"
ls -lh .output/*.zip 2>/dev/null | awk '{print "   " $9 " (" $5 ")"}'

# Step 5: Show dry-run command
echo ""
echo "5️⃣  Ready for submission!"
echo ""
echo -e "${YELLOW}Supported stores: Chrome Web Store, Firefox Add-ons${NC}"
echo ""
echo "   Test submission (dry-run for Chrome):"
echo "   ${YELLOW}yarn wxt submit --dry-run \\${NC}"
echo "     ${YELLOW}--chrome-zip .output/gmail-alias-toolkit-1.3.0-chrome.zip${NC}"
echo ""
echo "   Submit to Chrome Web Store (using .env.submit credentials):"
echo "   ${YELLOW}yarn wxt submit \\${NC}"
echo "     ${YELLOW}--chrome-zip .output/gmail-alias-toolkit-1.3.0-chrome.zip \\${NC}"
echo "     ${YELLOW}--chrome-extension-id \$CHROME_EXTENSION_ID \\${NC}"
echo "     ${YELLOW}--chrome-client-id \$CHROME_CLIENT_ID \\${NC}"
echo "     ${YELLOW}--chrome-client-secret \$CHROME_CLIENT_SECRET \\${NC}"
echo "     ${YELLOW}--chrome-refresh-token \$CHROME_REFRESH_TOKEN${NC}"
echo ""
echo "   Submit to Firefox Add-ons (using .env.submit credentials):"
echo "   ${YELLOW}yarn build:firefox && yarn zip:firefox${NC}"
echo "   ${YELLOW}yarn wxt submit \\${NC}"
echo "     ${YELLOW}--firefox-zip .output/gmail-alias-toolkit-1.3.0-firefox.zip \\${NC}"
echo "     ${YELLOW}--firefox-sources-zip .output/gmail-alias-toolkit-1.3.0-sources.zip \\${NC}"
echo "     ${YELLOW}--firefox-extension-id \$FIREFOX_EXTENSION_ID \\${NC}"
echo "     ${YELLOW}--firefox-jwt-issuer \$FIREFOX_JWT_ISSUER \\${NC}"
echo "     ${YELLOW}--firefox-jwt-secret \$FIREFOX_JWT_SECRET${NC}"
echo ""
echo -e "${GREEN}✓ All checks passed - ready for store submission!${NC}"
echo ""
echo "💡 Tip: Source .env.submit before running submit commands:"
echo "   ${YELLOW}source .env.submit${NC}"
