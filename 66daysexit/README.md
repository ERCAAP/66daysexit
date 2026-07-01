# Phoenix - 66 Day Life Transformation App

🔥 **Transform your life in 66 days** - A comprehensive habit-building and life transformation mobile application built with Expo React Native.

## 🌟 Features

### Core Features
- **66-Day Transformation Program**: Scientifically-backed habit formation journey
- **Personalized Assessment**: AI-driven program customization based on user goals
- **Daily Task Management**: Smart task generation and progress tracking
- **Gamification System**: XP, levels, achievements, and streak tracking
- **Progress Analytics**: Comprehensive charts and progress visualization
- **Achievement System**: Unlock rewards and celebrate milestones

### Advanced Features
- **Dark/Light Theme**: Complete theme system with system detection
- **Multi-language Support**: English and Turkish localization
- **Notification System**: Smart reminders with quiet hours
- **Social Features**: Share progress and achievements
- **Token System**: In-app currency for premium features
- **Offline Support**: Local storage with Firebase sync

### Technical Features
- **Modern Architecture**: Clean code with TypeScript
- **State Management**: Zustand for efficient state handling
- **Firebase Integration**: Authentication and real-time database
- **Responsive Design**: Optimized for all screen sizes
- **Performance Optimized**: Skeleton loading and efficient rendering
- **Error Boundaries**: Production-ready error handling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- Expo CLI installed globally: `npm install -g @expo/cli`
- iOS Simulator (Mac) or Android Studio emulator
- Firebase project (for production)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/phoenix-66days.git
   cd phoenix-66days/66daysexit
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase and app configuration
   ```

4. **Firebase Configuration**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password, Anonymous)
   - Enable Firestore Database
   - Copy your config to `src/config/firebase.ts` or use environment variables

5. **Start the development server**
   ```bash
   npm start
   ```

## 📱 Development

### Project Structure
```
66daysexit/
├── app/                     # Expo Router screens
│   ├── (tabs)/             # Tab navigation screens
│   ├── auth/               # Authentication screens
│   └── profile/            # Profile sub-screens
├── src/
│   ├── components/         # Reusable UI components
│   │   └── ui/            # Core UI component library
│   ├── services/          # Business logic and API services
│   ├── stores/            # Zustand state management
│   ├── theme/             # Design system and theming
│   ├── i18n/              # Internationalization
│   └── utils/             # Utility functions
├── assets/                # Images, fonts, and static assets
└── README.md
```

### Key Components

#### UI Components
- `Button` - Unified button component with variants
- `Card` - Glassmorphism card component
- `ProgressBar` - Animated progress indicators
- `Charts` - Data visualization components
- `TimePicker` - Custom time selection modal
- `ErrorBoundary` - Production error handling

#### Services
- `programGenerator` - Personalized task generation
- `firebaseService` - Database operations
- `achievementSystem` - Gamification logic
- `tokenSystem` - In-app currency management
- `notificationService` - Push notification handling

### Development Workflow

1. **Code Style**: ESLint and TypeScript for code quality
2. **State Management**: Use Zustand stores for global state
3. **Styling**: Theme-based styling with responsive design
4. **Testing**: Component and integration tests
5. **Performance**: Optimize with React.memo and useMemo

### Scripts

```bash
# Development
npm start                    # Start Expo development server
npm run android             # Run on Android emulator
npm run ios                 # Run on iOS simulator
npm run web                 # Run on web browser

# Code Quality
npm run lint                # Run ESLint
npm run lint:fix            # Fix ESLint errors
npm run type-check          # TypeScript type checking

# Building
npm run build:android       # Build Android APK
npm run build:ios          # Build iOS IPA
npm run build:all          # Build for all platforms

# Testing
npm test                    # Run tests
npm run test:watch         # Run tests in watch mode
```

## 🔧 Configuration

### Firebase Setup

1. Create a new Firebase project
2. Enable the following services:
   - **Authentication**: Email/Password, Anonymous
   - **Firestore Database**: Production mode
   - **Storage**: For user profile images (optional)

3. Add your app to the Firebase project:
   - iOS: `com.phoenix66days.app`
   - Android: `com.phoenix66days.app`

4. Update configuration in `src/config/firebase.ts` or set environment variables

### Environment Variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## 📊 Features Deep Dive

### Program Generation System
- **Assessment-based**: 7-question assessment determines user's starting point
- **Adaptive Tasks**: Tasks adjust based on user performance and preferences
- **Category Balance**: 6 core areas: Sleep, Water, Exercise, Mind, Screen Time, Shower
- **Weekly Themes**: Progressive difficulty and focus areas

### Gamification Elements
- **XP System**: Earn experience points for task completion
- **Level Progression**: Unlock new features and content
- **Achievement System**: 16+ achievements across different categories
- **Streak Tracking**: Daily and weekly streak maintenance
- **Token Economy**: Earn and spend tokens for premium features

### Progress Analytics
- **Visual Charts**: Line, bar, and radial progress charts
- **Category Performance**: Individual tracking for each habit area
- **Historical Data**: Track improvements over time
- **Completion Rates**: Daily, weekly, and monthly progress metrics

## 🌍 Internationalization

The app supports multiple languages with react-i18next:

- **English** (default)
- **Turkish**

To add a new language:
1. Create a new JSON file in `src/i18n/locales/`
2. Add translations for all keys
3. Update the language list in `src/i18n/index.ts`

## 🎨 Design System

### Color Palette
- **Primary**: Blue gradient (#6366f1 to #3b82f6)
- **Secondary**: Purple gradient (#8b5cf6 to #a855f7)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **Sizes**: xs, sm, base, lg, xl, 2xl, 3xl, 4xl
- **Weights**: normal, medium, semibold, bold
- **Line Heights**: Responsive to screen size

### Spacing System
- **Base Unit**: 4px
- **Scale**: xs(4), sm(8), md(12), lg(16), xl(20), 2xl(24), 3xl(32)

## 🚢 Deployment

### Building for Production

1. **Configure EAS (Expo Application Services)**
   ```bash
   npm install -g eas-cli
   eas login
   eas build:configure
   ```

2. **Build for stores**
   ```bash
   # Android Play Store
   eas build --platform android --profile production
   
   # iOS App Store
   eas build --platform ios --profile production
   ```

3. **Submit to stores**
   ```bash
   # Android
   eas submit --platform android
   
   # iOS
   eas submit --platform ios
   ```

### Environment Checklist

Before production deployment:

- [ ] Firebase configuration updated
- [ ] Environment variables set
- [ ] App icons and splash screens ready
- [ ] Privacy policy and terms of service URLs
- [ ] Analytics and crash reporting configured
- [ ] Push notification certificates (iOS)
- [ ] Google Play/App Store accounts ready

## 🔒 Security

- **Firebase Security Rules**: Properly configured Firestore rules
- **API Key Management**: Environment variables for sensitive data
- **User Data Protection**: GDPR compliant data handling
- **Authentication**: Secure Firebase Auth implementation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with conventional commits: `git commit -m "feat: add amazing feature"`
5. Push to your branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### Code Standards
- Use TypeScript for type safety
- Follow ESLint configuration
- Write tests for new features
- Maintain responsive design principles
- Document complex functionality

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Habit Formation Research**: Based on Dr. Phillippa Lally's 66-day habit formation study
- **UI/UX Inspiration**: Modern mobile design patterns and accessibility guidelines
- **Open Source Libraries**: Thanks to the React Native and Expo communities

## 📞 Support

- **Email**: support@phoenix66days.com
- **Documentation**: [docs.phoenix66days.com](https://docs.phoenix66days.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/phoenix-66days/issues)
- **Discord**: [Community Discord](https://discord.gg/phoenix66days)

---

**Transform your life, one day at a time. 🔥**
