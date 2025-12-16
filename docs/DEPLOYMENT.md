# Deployment Guide

This guide covers the deployment process for iOS and Android platforms.

## 📱 iOS Deployment

### Prerequisites

1. **Apple Developer Account** ($99/year)
2. **Xcode** (latest version)
3. **Valid certificates and provisioning profiles**

### Step 1: Update Version

Edit `ios/app/Info.plist`:

```xml
<key>CFBundleShortVersionString</key>
<string>1.0.0</string>
<key>CFBundleVersion</key>
<string>1</string>
```

Or update in Xcode: Target → General → Version/Build

### Step 2: Configure App Icons & Splash

1. Generate icons using [App Icon Generator](https://appicon.co/)
2. Place in `ios/app/Images.xcassets/AppIcon.appiconset/`
3. Add LaunchScreen in Xcode

### Step 3: Code Signing

1. Open `ios/app.xcworkspace` in Xcode
2. Select your target
3. Go to "Signing & Capabilities"
4. Select your Team
5. Enable "Automatically manage signing" or configure manually

### Step 4: Build for Release

```bash
# Clean build
cd ios
rm -rf build
xcodebuild clean
cd ..

# Build release
npx react-native run-ios --configuration Release
```

### Step 5: Archive & Upload

**Method 1: Using Xcode**

1. Product → Archive
2. Window → Organizer
3. Select archive → Distribute App
4. App Store Connect → Upload
5. Follow wizard

**Method 2: Using Fastlane** (Recommended)

```bash
cd ios
bundle exec fastlane beta  # TestFlight
bundle exec fastlane release  # App Store
```

### Step 6: App Store Connect

1. Log in to [App Store Connect](https://appstoreconnect.apple.com/)
2. Create new app
3. Fill in metadata (name, description, screenshots)
4. Select build
5. Submit for review

---

## 🤖 Android Deployment

### Prerequisites

1. **Google Play Console Account** ($25 one-time)
2. **Android Studio**
3. **Keystore for signing**

### Step 1: Generate Keystore

```bash
cd android/app

# Generate keystore
keytool -genkeypair -v -storetype PKCS12 \
  -keystore my-release-key.keystore \
  -alias my-key-alias \
  -keyalg RSA -keysize 2048 -validity 10000

# Save keystore password securely!
```

### Step 2: Configure Gradle

Edit `android/gradle.properties`:

```properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=*****
MYAPP_RELEASE_KEY_PASSWORD=*****
```

Edit `android/app/build.gradle`:

```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
        }
    }
}
```

### Step 3: Update Version

Edit `android/app/build.gradle`:

```gradle
android {
    defaultConfig {
        ...
        versionCode 1
        versionName "1.0.0"
    }
}
```

### Step 4: Build Release APK/AAB

```bash
cd android

# Build APK
./gradlew assembleRelease

# Build AAB (recommended for Play Store)
./gradlew bundleRelease

cd ..
```

Output:
- APK: `android/app/build/outputs/apk/release/app-release.apk`
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`

### Step 5: Test Release Build

```bash
# Install APK on device
adb install android/app/build/outputs/apk/release/app-release.apk
```

### Step 6: Upload to Play Store

**Method 1: Manual Upload**

1. Log in to [Google Play Console](https://play.google.com/console/)
2. Create new app
3. Complete store listing
4. Upload AAB under "Production" or "Internal testing"
5. Submit for review

**Method 2: Using Fastlane**

```bash
cd android
bundle exec fastlane beta  # Internal testing
bundle exec fastlane release  # Production
```

---

## 🚀 CI/CD with GitHub Actions

### Setup Secrets

Add to GitHub repository secrets:

**iOS:**
- `APPLE_ID`
- `APP_STORE_CONNECT_API_KEY`
- `MATCH_PASSWORD`
- `CERTIFICATES_GIT_URL`

**Android:**
- `ANDROID_KEYSTORE_BASE64`
- `ANDROID_KEYSTORE_PASSWORD`
- `ANDROID_KEY_ALIAS`
- `ANDROID_KEY_PASSWORD`

### Workflows

Workflows are in `.github/workflows/`:
- `ci.yml` - Run tests on PRs
- `build-ios.yml` - Build iOS app
- `build-android.yml` - Build Android app

---

## 🔧 Environment Configuration

### Production Environment

Create `.env.production`:

```env
APP_ENV=production
API_URL=https://api.production.com
ENABLE_ANALYTICS=true
ENABLE_CRASH_REPORTING=true
ENABLE_DEBUG_MENU=false
```

### Build with Different Environments

```bash
# iOS
ENVFILE=.env.production npx react-native run-ios --configuration Release

# Android
ENVFILE=.env.production npx react-native run-android --variant=release
```

---

## 📊 App Store Requirements

### iOS

**Screenshots:**
- 6.5" display (iPhone 14 Pro Max): Required
- 5.5" display (iPhone 8 Plus): Optional
- iPad Pro (12.9"): If supporting iPad

**App Icon:**
- 1024x1024 PNG (no transparency)

**Privacy Policy:**
- Required URL

### Android

**Screenshots:**
- Minimum 2, up to 8
- JPEG or 24-bit PNG (no alpha)
- Minimum dimension: 320px
- Maximum dimension: 3840px

**Feature Graphic:**
- 1024x500 PNG or JPEG

**App Icon:**
- 512x512 PNG
- Adaptive icon (foreground + background)

---

## 🐛 Common Issues

### iOS

**Code Signing Errors:**
```bash
# Clear derived data
rm -rf ~/Library/Developer/Xcode/DerivedData

# Re-install pods
cd ios
rm -rf Pods
bundle exec pod install
```

**Build Failed:**
```bash
# Clean build folder
xcodebuild clean -workspace ios/app.xcworkspace -scheme app
```

### Android

**Build Failed:**
```bash
# Clean gradle
cd android
./gradlew clean

# Clear gradle cache
rm -rf ~/.gradle/caches/
```

**Keystore Issues:**
- Ensure keystore file is in correct location
- Verify passwords in gradle.properties
- Check keystore alias

---

## 📱 Testing

### Internal Testing

**iOS (TestFlight):**
- Add internal testers in App Store Connect
- Automatic distribution after upload
- Up to 100 internal testers

**Android (Internal Testing):**
- Create internal testing track
- Add testers via email
- Up to 100 internal testers

### Beta Testing

**iOS (TestFlight):**
- Public link or invite
- Up to 10,000 external testers
- Requires Beta App Review

**Android (Closed Testing):**
- Create closed testing track
- Share via link or email list
- No limit on testers

---

## 📈 Post-Launch

### Monitoring

- **Crashlytics**: Monitor crashes
- **Analytics**: Track user behavior
- **Performance**: Monitor app performance

### Updates

1. Increment version number
2. Build new release
3. Upload to stores
4. Update release notes
5. Submit for review

### Hot Fixes

Use **CodePush** for JavaScript-only fixes:

```bash
# Install CodePush CLI
npm install -g code-push-cli

# Release update
code-push release-react <appName> <platform>
```

---

## 🔐 Security Checklist

- [ ] Remove all debug logs
- [ ] Disable developer menu in production
- [ ] Use ProGuard/R8 for Android
- [ ] Enable SSL pinning
- [ ] Secure API keys
- [ ] Implement app signing
- [ ] Add integrity checks
- [ ] Enable app transport security (iOS)

---

## 📚 Resources

- [iOS App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Developer Policy](https://play.google.com/about/developer-content-policy/)
- [React Native Publishing Guide](https://reactnative.dev/docs/signed-apk-android)
- [Fastlane Documentation](https://docs.fastlane.tools/)

---

Need help? Check the [troubleshooting section](#-common-issues) or open an issue!
