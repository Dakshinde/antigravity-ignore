#!/bin/bash
# setup_test_env.sh - Creates a dummy monorepo structure to test Antigravity Ignore logic

# Create directories
mkdir -p demo_monorepo/frontend/src
mkdir -p demo_monorepo/backend/src

# Create Root .gitignore
echo "node_modules/" > demo_monorepo/.gitignore

# Create Frontend nested .gitignore
echo ".env" > demo_monorepo/frontend/.gitignore

# Note: We do intentionally NOT create a backend/.gitignore!

# Create dummy files to right-click on inside VSCode
touch demo_monorepo/frontend/src/app.js
touch demo_monorepo/frontend/src/style.css
touch demo_monorepo/backend/src/server.js
touch demo_monorepo/backend/src/config.json

echo "✅ Test environment created!"
echo ""
echo "🚀 Next Steps:"
echo "1. Run 'chmod +x setup_test_env.sh' if you haven't and 'npm run compile' to build."
echo "2. Press F5 in VSCode to open the Extension Development Host."
echo "3. Open the '/home/dakshhinde/antigravity-ignore/demo_monorepo' folder in that host."
echo "4. Test Frontend: Right click 'app.js' -> Since it has a nested ignore, you should see the QuickPick (Hoist or Keep)."
echo "5. Test Backend: Right click 'server.js' -> Since it lacks a nested ignore, it should go smoothly to Root without prompt."
