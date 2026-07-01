import { auth, db, analytics } from '../config/firebase';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInAnonymously,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  orderBy,
  limit,
  deleteDoc
} from 'firebase/firestore';
import { logEvent } from 'firebase/analytics';

// Types
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  preferences: {
    language: string;
    theme: string;
    notifications: boolean;
  };
  program: {
    startDate: Date | null;
    currentDay: number;
    completedDays: number;
    streak: number;
    totalXP: number;
    level: number;
    tokens: number;
  };
  assessmentData?: any;
}

export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  day: number;
  xpReward: number;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
}

export interface Achievement {
  id: string;
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  xpEarned: number;
}

// Auth Functions
export const createAccount = async (email: string, password: string, displayName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update profile with display name
    await updateProfile(user, { displayName });
    
    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: user.uid,
      email: user.email!,
      displayName,
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {
        language: 'tr',
        theme: 'system',
        notifications: true
      },
      program: {
        startDate: null,
        currentDay: 0,
        completedDays: 0,
        streak: 0,
        totalXP: 0,
        level: 1,
        tokens: 1000 // Starting tokens
      }
    };
    
    await setDoc(doc(db, 'users', user.uid), userProfile);
    
    // Log analytics event
    if (analytics) {
      logEvent(analytics, 'sign_up', {
        method: 'email'
      });
    }
    
    return user;
  } catch (error) {
    console.error('Create account error:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Log analytics event
    if (analytics) {
      logEvent(analytics, 'login', {
        method: 'email'
      });
    }
    
    return userCredential.user;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
};

export const signInAnonymous = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    const user = userCredential.user;
    
    // Create anonymous user profile
    const userProfile: UserProfile = {
      uid: user.uid,
      email: 'anonymous@daysexit.com',
      displayName: 'Anonymous User',
      createdAt: new Date(),
      updatedAt: new Date(),
      preferences: {
        language: 'tr',
        theme: 'system',
        notifications: false
      },
      program: {
        startDate: null,
        currentDay: 0,
        completedDays: 0,
        streak: 0,
        totalXP: 0,
        level: 1,
        tokens: 500 // Less tokens for anonymous users
      }
    };
    
    await setDoc(doc(db, 'users', user.uid), userProfile);
    
    // Log analytics event
    if (analytics) {
      logEvent(analytics, 'login', {
        method: 'anonymous'
      });
    }
    
    return user;
  } catch (error) {
    console.error('Anonymous sign in error:', error);
    throw error;
  }
};

export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    
    // Log analytics event
    if (analytics) {
      logEvent(analytics, 'password_reset_requested');
    }
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
    
    // Log analytics event
    if (analytics) {
      logEvent(analytics, 'logout');
    }
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

// User Profile Functions
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        program: {
          ...data.program,
          startDate: data.program?.startDate?.toDate() || null
        }
      } as UserProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};

export const updateUserProfile = async (uid: string, updates: Partial<UserProfile>) => {
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    throw error;
  }
};

// Task Functions
export const createTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
  try {
    const docRef = await addDoc(collection(db, 'tasks'), {
      ...task,
      createdAt: serverTimestamp()
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Create task error:', error);
    throw error;
  }
};

export const getUserTasks = async (userId: string, day?: number): Promise<Task[]> => {
  try {
    let q = query(
      collection(db, 'tasks'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    if (day !== undefined) {
      q = query(
        collection(db, 'tasks'),
        where('userId', '==', userId),
        where('day', '==', day),
        orderBy('createdAt', 'desc')
      );
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
      completedAt: doc.data().completedAt?.toDate()
    })) as Task[];
  } catch (error) {
    console.error('Get user tasks error:', error);
    throw error;
  }
};

export const completeTask = async (taskId: string, xpEarned: number) => {
  try {
    const taskRef = doc(db, 'tasks', taskId);
    await updateDoc(taskRef, {
      completed: true,
      completedAt: serverTimestamp()
    });
    
    // Log analytics event
    if (analytics) {
      logEvent(analytics, 'task_completed', {
        task_id: taskId,
        xp_earned: xpEarned
      });
    }
  } catch (error) {
    console.error('Complete task error:', error);
    throw error;
  }
};

// Achievement Functions
export const unlockAchievement = async (userId: string, achievementId: string, xpEarned: number) => {
  try {
    const achievementData: Omit<Achievement, 'id'> = {
      userId,
      achievementId,
      unlockedAt: new Date(),
      xpEarned
    };
    
    const docRef = await addDoc(collection(db, 'achievements'), {
      ...achievementData,
      unlockedAt: serverTimestamp()
    });
    
    // Log analytics event
    if (analytics) {
      logEvent(analytics, 'achievement_unlocked', {
        achievement_id: achievementId,
        xp_earned: xpEarned
      });
    }
    
    return docRef.id;
  } catch (error) {
    console.error('Unlock achievement error:', error);
    throw error;
  }
};

export const getUserAchievements = async (userId: string): Promise<Achievement[]> => {
  try {
    const q = query(
      collection(db, 'achievements'),
      where('userId', '==', userId),
      orderBy('unlockedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      unlockedAt: doc.data().unlockedAt?.toDate() || new Date()
    })) as Achievement[];
  } catch (error) {
    console.error('Get user achievements error:', error);
    throw error;
  }
};

// Analytics Functions
export const logCustomEvent = (eventName: string, parameters?: any) => {
  if (analytics) {
    logEvent(analytics, eventName, parameters);
  }
};

export const logProgramStart = (userId: string) => {
  if (analytics) {
    logEvent(analytics, 'program_started', {
      user_id: userId
    });
  }
};

export const logDayCompleted = (userId: string, day: number, xpEarned: number) => {
  if (analytics) {
    logEvent(analytics, 'day_completed', {
      user_id: userId,
      day: day,
      xp_earned: xpEarned
    });
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Test Firebase connection
export const testFirebaseConnection = async () => {
  try {
    console.log('🔥 Testing Firebase connection...');
    
    // Test Firestore
    const testDoc = doc(db, 'test', 'connection');
    await setDoc(testDoc, { 
      timestamp: serverTimestamp(),
      message: 'Firebase connection test successful'
    });
    
    // Clean up test document
    await deleteDoc(testDoc);
    
    console.log('✅ Firebase connection test passed');
    return true;
  } catch (error) {
    console.error('❌ Firebase connection test failed:', error);
    return false;
  }
}; 