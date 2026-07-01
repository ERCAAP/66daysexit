import { Linking, Share, Platform, Alert } from 'react-native';

interface ShareContent {
  message: string;
  url?: string;
  title?: string;
}

export class SocialFeatures {
  /**
   * Opens the app store for rating
   */
  static async rateApp(): Promise<void> {
    try {
      const storeUrl = Platform.select({
        ios: 'https://apps.apple.com/app/phoenix-66days-life-transformation/id1234567890',
        android: 'https://play.google.com/store/apps/details?id=com.phoenix66days.app',
      });
      
      if (storeUrl) {
        await Linking.openURL(storeUrl);
      }
    } catch (error) {
      console.error('Error opening app store:', error);
      Alert.alert('Error', 'Unable to open app store. Please try again later.');
    }
  }

  /**
   * Shares the app with others
   */
  static async shareApp(customMessage?: string): Promise<void> {
    try {
      const defaultMessage = 'Transform your life in 66 days with Phoenix! 🔥\n\nJoin me on this incredible journey of building lasting habits. Download the app now:';
      const appUrl = Platform.select({
        ios: 'https://apps.apple.com/app/phoenix-66days-life-transformation/id1234567890',
        android: 'https://play.google.com/store/apps/details?id=com.phoenix66days.app',
      });

      const shareContent: ShareContent = {
        message: customMessage || `${defaultMessage}\n${appUrl}`,
        url: appUrl,
        title: 'Phoenix - 66 Day Life Transformation',
      };

      const result = await Share.share(shareContent);
      
      if (result.action === Share.sharedAction) {
        console.log('App shared successfully');
      }
    } catch (error) {
      console.error('Error sharing app:', error);
      Alert.alert('Error', 'Unable to share app. Please try again later.');
    }
  }

  /**
   * Shares user progress and achievements
   */
  static async shareProgress(userStats: {
    level: number;
    currentDay: number;
    streak: number;
    xp: number;
  }): Promise<void> {
    try {
      const message = `🔥 My Phoenix Journey Update! 🔥\n\n` +
        `📅 Day ${userStats.currentDay} of 66\n` +
        `⚡ Level ${userStats.level}\n` +
        `🔥 ${userStats.streak} day streak\n` +
        `✨ ${userStats.xp} XP earned\n\n` +
        `Transforming my life one day at a time with Phoenix! Join me:\n` +
        `${Platform.select({
          ios: 'https://apps.apple.com/app/phoenix-66days-life-transformation/id1234567890',
          android: 'https://play.google.com/store/apps/details?id=com.phoenix66days.app',
        })}`;

      await Share.share({
        message,
        title: 'My Phoenix Progress',
      });
    } catch (error) {
      console.error('Error sharing progress:', error);
      Alert.alert('Error', 'Unable to share progress. Please try again later.');
    }
  }

  /**
   * Shares achievement unlock
   */
  static async shareAchievement(achievement: {
    title: string;
    description: string;
    icon: string;
  }): Promise<void> {
    try {
      const message = `🏆 Achievement Unlocked! 🏆\n\n` +
        `${achievement.title}\n` +
        `${achievement.description}\n\n` +
        `Building better habits with Phoenix! 💪\n` +
        `${Platform.select({
          ios: 'https://apps.apple.com/app/phoenix-66days-life-transformation/id1234567890',
          android: 'https://play.google.com/store/apps/details?id=com.phoenix66days.app',
        })}`;

      await Share.share({
        message,
        title: `Achievement: ${achievement.title}`,
      });
    } catch (error) {
      console.error('Error sharing achievement:', error);
      Alert.alert('Error', 'Unable to share achievement. Please try again later.');
    }
  }

  /**
   * Opens social media profiles
   */
  static async openSocialMedia(platform: 'twitter' | 'instagram' | 'facebook' | 'linkedin'): Promise<void> {
    try {
      const urls = {
        twitter: {
          app: 'twitter://user?screen_name=phoenix66days',
          web: 'https://twitter.com/phoenix66days',
        },
        instagram: {
          app: 'instagram://user?username=phoenix66days',
          web: 'https://instagram.com/phoenix66days',
        },
        facebook: {
          app: 'fb://profile/phoenix66days',
          web: 'https://facebook.com/phoenix66days',
        },
        linkedin: {
          app: 'linkedin://company/phoenix66days',
          web: 'https://linkedin.com/company/phoenix66days',
        },
      };

      const platformUrls = urls[platform];
      let canOpen = false;

      // Try app URL first
      if (platformUrls.app) {
        canOpen = await Linking.canOpenURL(platformUrls.app);
        if (canOpen) {
          await Linking.openURL(platformUrls.app);
          return;
        }
      }

      // Fallback to web URL
      await Linking.openURL(platformUrls.web);
    } catch (error) {
      console.error(`Error opening ${platform}:`, error);
      Alert.alert('Error', `Unable to open ${platform}. Please try again later.`);
    }
  }

  /**
   * Invites friends via various methods
   */
  static async inviteFriends(): Promise<void> {
    try {
      Alert.alert(
        'Invite Friends',
        'How would you like to invite your friends?',
        [
          {
            text: 'Share App',
            onPress: () => this.shareApp(),
          },
          {
            text: 'Share Progress',
            onPress: () => {
              // This would typically get user stats from the store
              const mockStats = {
                level: 3,
                currentDay: 15,
                streak: 7,
                xp: 450,
              };
              this.shareProgress(mockStats);
            },
          },
          {
            text: 'Copy Link',
            onPress: async () => {
              const appUrl = Platform.select({
                ios: 'https://apps.apple.com/app/phoenix-66days-life-transformation/id1234567890',
                android: 'https://play.google.com/store/apps/details?id=com.phoenix66days.app',
              });
              
              if (appUrl) {
                // In a real app, you'd use Clipboard API
                await Share.share({ message: appUrl });
              }
            },
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      console.error('Error inviting friends:', error);
    }
  }

  /**
   * Provides feedback options
   */
  static async provideFeedback(): Promise<void> {
    try {
      Alert.alert(
        'Provide Feedback',
        'How would you like to provide feedback?',
        [
          {
            text: 'Rate App',
            onPress: () => this.rateApp(),
          },
          {
            text: 'Send Email',
            onPress: () => {
              const email = 'feedback@phoenix66days.com';
              const subject = 'Phoenix App Feedback';
              const body = 'Hi Phoenix team,\n\nI have feedback about the app:\n\n';
              Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`);
            },
          },
          {
            text: 'Join Community',
            onPress: () => this.openSocialMedia('twitter'),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      console.error('Error providing feedback:', error);
    }
  }

  /**
   * Opens help and support resources
   */
  static async getHelp(): Promise<void> {
    try {
      Alert.alert(
        'Get Help',
        'Choose a support option:',
        [
          {
            text: 'Help Center',
            onPress: () => Linking.openURL('https://phoenix66days.com/help'),
          },
          {
            text: 'Contact Support',
            onPress: () => {
              const email = 'support@phoenix66days.com';
              const subject = 'Phoenix App Support Request';
              const body = 'Hi Phoenix support team,\n\nI need help with:\n\n';
              Linking.openURL(`mailto:${email}?subject=${subject}&body=${body}`);
            },
          },
          {
            text: 'Community Forum',
            onPress: () => Linking.openURL('https://phoenix66days.com/community'),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      console.error('Error getting help:', error);
    }
  }
} 