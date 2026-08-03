#!/bin/bash
# EduFlow AI OS - White-Label APK Generator (Ultra Pro & Ultra Pro+)

set -e

if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <institution_id> <app_name>"
    echo "Example: $0 springfield 'Springfield College App'"
    exit 1
fi

INSTITUTION_ID=$1
APP_NAME=$2

echo "================================================================"
echo "🚀 Generating White-Label APK for: $APP_NAME ($INSTITUTION_ID)"
echo "================================================================"

cd eduflow_app

echo "Cleaning previous builds..."
flutter clean
flutter pub get

# Compile passing the arguments to Gradle via Dart defines or P-Args
echo "Building APK for Whitelabel Flavor..."
flutter build apk --flavor whitelabel --dart-define=APP_NAME="$APP_NAME" --dart-define=INSTITUTION_ID="$INSTITUTION_ID"

# In a real CI/CD pipeline, the Gradle build would intercept the Dart defines
# or we'd pass them as P arguments like:
# flutter build apk --flavor whitelabel --build-name=1.0.0 --build-number=1 -P APP_NAME="$APP_NAME" -P INSTITUTION_ID="$INSTITUTION_ID"

echo "================================================================"
echo "✅ Build Complete!"
echo "APK Location: build/app/outputs/flutter-apk/app-whitelabel-release.apk"
echo "================================================================"
