# Mobile Starter - React Native CLI

A production-ready React Native CLI starter template with best practices, TypeScript, and essential features pre-configured.

## ✨ Features

- ⚡️ **React Native 0.82** with React 19
- 🎯 **TypeScript** with strict type checking
- 📱 **React Navigation** (Stack, Tab, Drawer)
- 🗂️ **State Management** with Zustand + MMKV storage
- 🌐 **API Integration** with Axios and interceptors
- 🎨 **Theming** with light/dark mode support
- 🧪 **Testing** setup with Jest
- 📏 **Code Quality** with ESLint, Prettier, Husky
- 🌍 **Internationalization** ready (i18n)
- 🛡️ **Error Boundary** for error handling
- 📡 **Network Detection** utility
- 🔧 **Development Tools** and utilities

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 20.0.0
- **npm** or **yarn**
- **Xcode** (for iOS development) - Latest version
- **Android Studio** (for Android development)
- **CocoaPods** (for iOS) - `gem install cocoapods`
- **Ruby** with Bundler - `gem install bundler`

For detailed environment setup, see [React Native Environment Setup](https://reactnative.dev/docs/set-up-your-environment).

## 🚀 Quick Start

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url> my-app
cd my-app/app

# Install dependencies
npm install

# iOS: Install CocoaPods
cd ios && bundle install && bundle exec pod install && cd ..
```

### 2. Environment Configuration

```bash
# Copy the environment template
cp .env.example .env

# Edit .env with your configuration
# Add API URLs, feature flags, etc.
```

### 3. Run the App

```bash
# Start Metro bundler
npm start

# Run on iOS (in a new terminal)
npm run ios

# Run on Android (in a new terminal)
npm run android
```

## 📁 Project Structure

```
app/
├── src/
│   ├── api/              # API client and endpoints
│   │   ├── client.ts     # Axios configuration
│   │   └── endpoints/    # API endpoint definitions
│   ├── assets/           # Images, fonts, etc.
│   ├── components/       # Reusable components
│   │   ├── forms/        # Form components
│   │   ├── layout/       # Layout components
│   │   ├── navigation/   # Navigation components
│   │   └── ui/           # UI primitives
│   ├── config/           # App configuration
│   │   ├── constants.ts  # App constants
│   │   ├── env.ts        # Environment config
│   │   └── theme.ts      # Theme configuration
│   ├── constants/        # Additional constants
│   ├── hooks/            # Custom React hooks
│   │   ├── useApi.ts
│   │   ├── useDebounce.ts
│   │   ├── useKeyboard.ts
│   │   ├── useNetworkStatus.ts
│   │   └── usePrevious.ts
│   ├── navigation/       # Navigation setup
│   │   ├── index.tsx     # Root navigator
│   │   ├── linking.ts    # Deep linking config
│   │   └── types.ts      # Navigation types
│   ├── screens/          # Screen components
│   │   ├── auth/         # Auth screens
│   │   └── home/         # Home screens
│   ├── store/            # State management (Zustand)
│   │   ├── index.ts
│   │   └── slices/       # Store slices
│   ├── types/            # TypeScript types
│   │   ├── global.d.ts
│   │   └── env.d.ts
│   └── utils/            # Utility functions
│       ├── constants.ts
│       ├── device.ts
│       ├── formatters.ts
│       ├── helpers.ts
│       ├── logger.ts
│       ├── storage.ts
│       └── validators.ts
├── __tests__/            # Test files
├── android/              # Android native code
├── ios/                  # iOS native code
├── .env                  # Environment variables (gitignored)
├── .env.example          # Environment template
├── App.tsx               # App entry point
└── package.json
```

## 🛠️ Available Scripts

### Development

```bash
npm start              # Start Metro bundler
npm run ios            # Run on iOS simulator
npm run android        # Run on Android emulator
```

### Code Quality

```bash
npm run lint           # Lint code
npm run lint:fix       # Fix linting errors
npm run type-check     # Run TypeScript type checking
npm run format         # Format code with Prettier
npm run format:check   # Check code formatting
```

### Testing

```bash
npm test               # Run tests
npm run test:watch     # Run tests in watch mode
npm run test:coverage  # Generate coverage report
```

### Cleanup

```bash
npm run clean          # Clean all build artifacts
npm run clean:ios      # Clean iOS build
npm run clean:android  # Clean Android build
```

## 🎨 Theming

The app supports light and dark themes. Theme configuration is in `src/config/theme.ts`.

```typescript
import { useUIStore } from '@store';

// Toggle theme
const { theme, toggleTheme } = useUIStore();
```

## 🌐 API Integration

API client is configured in `src/api/client.ts` with:
- Automatic token refresh
- Request/response interceptors
- Error handling
- CSRF protection for Django

```typescript
import { api } from '@api/client';

// Make API calls
const response = await api.auth.login(email, password);
```

## 📡 Network Detection

```typescript
import { useNetworkStatus } from '@hooks/useNetworkStatus';

const { isConnected, isInternetReachable } = useNetworkStatus();
```

## 💾 Storage

Type-safe storage using MMKV:

```typescript
import { Storage } from '@utils/storage';

// String storage
Storage.setString('key', 'value');
const value = Storage.getString('key');

// Object storage
Storage.setObject('user', { name: 'John' });
const user = Storage.getObject<User>('user');
```

## 🧪 Testing

Tests are located in `__tests__/` directory. Run tests with:

```bash
npm test
```

## 🚢 Deployment

### iOS

1. Update version in `ios/app/Info.plist`
2. Configure signing in Xcode
3. Build for release: `npm run ios --configuration Release`

### Android

1. Update version in `android/app/build.gradle`
2. Configure signing in `android/app/build.gradle`
3. Build APK: `cd android && ./gradlew assembleRelease`

For detailed deployment instructions, see [DEPLOYMENT.md](docs/DEPLOYMENT.md).

## 🤝 Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

### Commit Message Format

We follow conventional commits:

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: code style changes
refactor: code refactoring
test: add or update tests
chore: maintenance tasks
```

## 📚 Documentation

- [Architecture](docs/ARCHITECTURE.md) - Technical architecture overview
- [Deployment](docs/DEPLOYMENT.md) - Deployment guide
- [Contributing](CONTRIBUTING.md) - Contribution guidelines

## 🐛 Troubleshooting

### iOS Build Issues

```bash
# Clean and reinstall pods
cd ios
pod deintegrate
pod install
cd ..
```

### Android Build Issues

```bash
# Clean Gradle
cd android
./gradlew clean
cd ..
```

### Metro Bundler Issues

```bash
# Reset cache
npm start -- --reset-cache
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- React Native team
- All open source contributors
- Community packages and libraries

---

Made with ❤️ for the React Native community
