import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  AuthError,
  Auth
} from 'firebase/auth';
import { auth } from '../config/firebase';

interface UserProfile {
  id: string;
  email?: string;
  isAnonymous: boolean;
  displayName?: string;
  photoURL?: string;
  createdAt: string;
  lastLoginAt: string;
  hasCompletedOnboarding: boolean;
  currentDay: number;
  startDate?: string;
  level: number;
  xp: number;
  streak: number;
}

interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  
  // Actions
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  clearError: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      userProfile: null,
      isLoading: false,
      isInitialized: false,
      error: null,

      signInWithEmail: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const userCredential = await signInWithEmailAndPassword(auth as Auth, email, password);
          const user = userCredential.user;
          
          // Create or update user profile
          const profile: UserProfile = {
            id: user.uid,
            email: user.email || undefined,
            isAnonymous: false,
            displayName: user.displayName || undefined,
            photoURL: user.photoURL || undefined,
            createdAt: user.metadata.creationTime || new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            hasCompletedOnboarding: get().userProfile?.hasCompletedOnboarding || false,
            currentDay: get().userProfile?.currentDay || 1,
            startDate: get().userProfile?.startDate,
            level: get().userProfile?.level || 1,
            xp: get().userProfile?.xp || 0,
            streak: get().userProfile?.streak || 0,
          };
          
          set({ user, userProfile: profile, isLoading: false });
        } catch (error) {
          const authError = error as AuthError;
          set({ error: authError.message, isLoading: false });
          throw error;
        }
      },

      signUpWithEmail: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const userCredential = await createUserWithEmailAndPassword(auth as Auth, email, password);
          const user = userCredential.user;
          
          const profile: UserProfile = {
            id: user.uid,
            email: user.email || undefined,
            isAnonymous: false,
            displayName: user.displayName || undefined,
            photoURL: user.photoURL || undefined,
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            hasCompletedOnboarding: false,
            currentDay: 1,
            level: 1,
            xp: 0,
            streak: 0,
          };
          
          set({ user, userProfile: profile, isLoading: false });
        } catch (error) {
          const authError = error as AuthError;
          set({ error: authError.message, isLoading: false });
          throw error;
        }
      },

      signInAnonymously: async () => {
        set({ isLoading: true, error: null });
        try {
          const userCredential = await signInAnonymously(auth as Auth);
          const user = userCredential.user;
          
          const profile: UserProfile = {
            id: user.uid,
            isAnonymous: true,
            createdAt: new Date().toISOString(),
            lastLoginAt: new Date().toISOString(),
            hasCompletedOnboarding: false,
            currentDay: 1,
            level: 1,
            xp: 0,
            streak: 0,
          };
          
          set({ user, userProfile: profile, isLoading: false });
        } catch (error) {
          const authError = error as AuthError;
          set({ error: authError.message, isLoading: false });
          throw error;
        }
      },

      signOut: async () => {
        set({ isLoading: true, error: null });
        try {
          await signOut(auth as Auth);
          set({ user: null, userProfile: null, isLoading: false });
        } catch (error) {
          const authError = error as AuthError;
          set({ error: authError.message, isLoading: false });
          throw error;
        }
      },

      updateUserProfile: (updates: Partial<UserProfile>) => {
        const currentProfile = get().userProfile;
        if (currentProfile) {
          set({ userProfile: { ...currentProfile, ...updates } });
        }
      },

      clearError: () => set({ error: null }),

      initialize: () => {
        if (get().isInitialized) return;
        
        const unsubscribe = onAuthStateChanged(auth as Auth, (user) => {
          set({ user, isInitialized: true, isLoading: false });
        });

        set({ isInitialized: true });
        return unsubscribe;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ userProfile: state.userProfile }),
    }
  )
); 