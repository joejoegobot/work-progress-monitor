#!/bin/bash

echo "Preparing Work Progress Monitor for native app compilation..."

# Navigate to the project directory
cd /Users/joe/.openclaw/workspace/work-progress-monitor

# Install Capacitor CLI globally if not already installed
npm install -g @capacitor/cli

# Install all dependencies
npm install

# Add iOS platform
npx cap add ios

# Add Android platform (for completeness)
npx cap add android

# Copy web assets to native projects
npx cap copy

# Update native projects
npx cap update

echo ""
echo "Setup complete! The app is now prepared for native compilation."
echo ""
echo "To continue with iOS app development:"
echo "1. Open work-progress-monitor/ios/App/App.xcworkspace in Xcode"
echo "2. Configure your Apple Developer account and signing"
echo "3. Build and archive the app"
echo "4. Submit to App Store Connect"
echo ""
echo "Additional steps needed for App Store submission:"
echo "- Obtain an Apple Developer Program membership ($99/year)"
echo "- Create app IDs, certificates, and provisioning profiles"
echo "- Test thoroughly on real devices"
echo "- Prepare marketing materials (screenshots, descriptions)"
echo "- Comply with App Store Review Guidelines"
echo ""
echo "For more information about App Store submission, visit: https://developer.apple.com/app-store/"