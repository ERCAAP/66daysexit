import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_BALANCE_KEY = 'user_token_balance';
const TOKEN_HISTORY_KEY = 'user_token_history';

export interface TokenTransaction {
  id: string;
  type: 'earn' | 'spend' | 'purchase';
  amount: number;
  description: string;
  timestamp: string;
  category?: 'video' | 'image' | 'task_completion' | 'achievement' | 'daily_bonus' | 'purchase';
}

export interface TokenBalance {
  current: number;
  lifetime: number;
  lastUpdated: string;
}

export interface TokenPackage {
  id: string;
  name: string;
  tokens: number;
  price: number;
  bonusTokens: number;
  popular?: boolean;
  description: string;
}

class TokenSystem {
  private readonly tokenPackages: TokenPackage[] = [
    {
      id: 'starter',
      name: 'Starter Pack',
      tokens: 100,
      price: 2.99,
      bonusTokens: 10,
      description: 'Perfect for trying out AI features',
    },
    {
      id: 'creator',
      name: 'Creator Pack',
      tokens: 500,
      price: 9.99,
      bonusTokens: 75,
      popular: true,
      description: 'Great for regular content creation',
    },
    {
      id: 'pro',
      name: 'Pro Pack',
      tokens: 1200,
      price: 19.99,
      bonusTokens: 200,
      description: 'For power users and professionals',
    },
    {
      id: 'ultimate',
      name: 'Ultimate Pack',
      tokens: 3000,
      price: 39.99,
      bonusTokens: 600,
      description: 'Maximum value for serious creators',
    },
  ];

  private readonly tokenCosts = {
    // AI generation costs
    image_generation: 5,
    video_generation: 15,
    style_transfer: 8,
    upscale_image: 3,
    
    // Premium features
    premium_task: 2,
    custom_program: 20,
    advanced_analytics: 5,
  };

  async getTokenBalance(): Promise<TokenBalance> {
    try {
      const balance = await AsyncStorage.getItem(TOKEN_BALANCE_KEY);
      if (balance) {
        return JSON.parse(balance);
      }
    } catch (error) {
      console.error('Error loading token balance:', error);
    }

    // Return default balance for new users
    const defaultBalance: TokenBalance = {
      current: 50, // Free starter tokens
      lifetime: 50,
      lastUpdated: new Date().toISOString(),
    };

    await this.saveTokenBalance(defaultBalance);
    return defaultBalance;
  }

  async saveTokenBalance(balance: TokenBalance): Promise<void> {
    try {
      balance.lastUpdated = new Date().toISOString();
      await AsyncStorage.setItem(TOKEN_BALANCE_KEY, JSON.stringify(balance));
    } catch (error) {
      console.error('Error saving token balance:', error);
    }
  }

  async getTokenHistory(): Promise<TokenTransaction[]> {
    try {
      const history = await AsyncStorage.getItem(TOKEN_HISTORY_KEY);
      if (history) {
        return JSON.parse(history);
      }
    } catch (error) {
      console.error('Error loading token history:', error);
    }
    return [];
  }

  async saveTokenHistory(history: TokenTransaction[]): Promise<void> {
    try {
      // Keep only last 100 transactions for performance
      const recentHistory = history.slice(-100);
      await AsyncStorage.setItem(TOKEN_HISTORY_KEY, JSON.stringify(recentHistory));
    } catch (error) {
      console.error('Error saving token history:', error);
    }
  }

  async addTransaction(transaction: Omit<TokenTransaction, 'id' | 'timestamp'>): Promise<void> {
    const fullTransaction: TokenTransaction = {
      ...transaction,
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    const history = await this.getTokenHistory();
    history.push(fullTransaction);
    await this.saveTokenHistory(history);
  }

  async spendTokens(amount: number, description: string, category?: TokenTransaction['category']): Promise<boolean> {
    const balance = await this.getTokenBalance();
    
    if (balance.current < amount) {
      return false; // Insufficient tokens
    }

    balance.current -= amount;
    await this.saveTokenBalance(balance);

    await this.addTransaction({
      type: 'spend',
      amount: -amount,
      description,
      category,
    });

    return true;
  }

  async earnTokens(amount: number, description: string, category?: TokenTransaction['category']): Promise<void> {
    const balance = await this.getTokenBalance();
    
    balance.current += amount;
    balance.lifetime += amount;
    await this.saveTokenBalance(balance);

    await this.addTransaction({
      type: 'earn',
      amount,
      description,
      category,
    });
  }

  async purchaseTokens(packageId: string): Promise<boolean> {
    const tokenPackage = this.tokenPackages.find(p => p.id === packageId);
    if (!tokenPackage) {
      throw new Error('Invalid token package');
    }

    const balance = await this.getTokenBalance();
    const totalTokens = tokenPackage.tokens + tokenPackage.bonusTokens;
    
    balance.current += totalTokens;
    balance.lifetime += totalTokens;
    await this.saveTokenBalance(balance);

    await this.addTransaction({
      type: 'purchase',
      amount: totalTokens,
      description: `Purchased ${tokenPackage.name}`,
      category: 'purchase',
    });

    return true;
  }

  getTokenPackages(): TokenPackage[] {
    return this.tokenPackages;
  }

  getTokenCost(action: keyof typeof this.tokenCosts): number {
    return this.tokenCosts[action] || 0;
  }

  calculateEstimatedCost(prompt: string, type: 'image' | 'video'): number {
    const baseContent = type === 'video' ? this.tokenCosts.video_generation : this.tokenCosts.image_generation;
    
    // Add complexity multiplier based on prompt length
    const complexityMultiplier = Math.min(1 + (prompt.length / 200), 2);
    
    return Math.floor(baseContent * complexityMultiplier);
  }

  async canAfford(action: keyof typeof this.tokenCosts): Promise<boolean> {
    const balance = await this.getTokenBalance();
    const cost = this.getTokenCost(action);
    return balance.current >= cost;
  }

  async canAffordAmount(amount: number): Promise<boolean> {
    const balance = await this.getTokenBalance();
    return balance.current >= amount;
  }

  // Gamification features
  async awardDailyBonus(): Promise<number> {
    const bonusAmount = 10;
    await this.earnTokens(bonusAmount, 'Daily login bonus', 'daily_bonus');
    return bonusAmount;
  }

  async awardTaskCompletion(difficulty: 'easy' | 'medium' | 'hard'): Promise<number> {
    const rewards = {
      easy: 1,
      medium: 2,
      hard: 3,
    };
    
    const amount = rewards[difficulty];
    await this.earnTokens(amount, `Completed ${difficulty} task`, 'task_completion');
    return amount;
  }

  async awardAchievement(achievementName: string, xpValue: number): Promise<number> {
    // Convert XP to tokens (1 XP = 0.1 tokens)
    const tokenAmount = Math.floor(xpValue * 0.1);
    await this.earnTokens(tokenAmount, `Achievement: ${achievementName}`, 'achievement');
    return tokenAmount;
  }

  // Analytics
  async getSpendingStats(days: number = 30): Promise<{
    totalSpent: number;
    averageDaily: number;
    mostUsedCategory: string;
    categoryBreakdown: { [key: string]: number };
  }> {
    const history = await this.getTokenHistory();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const recentTransactions = history.filter(tx => 
      tx.type === 'spend' && new Date(tx.timestamp) >= cutoffDate
    );

    const totalSpent = recentTransactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    const averageDaily = totalSpent / days;

    const categoryBreakdown: { [key: string]: number } = {};
    recentTransactions.forEach(tx => {
      const category = tx.category || 'other';
      categoryBreakdown[category] = (categoryBreakdown[category] || 0) + Math.abs(tx.amount);
    });

    const mostUsedCategory = Object.entries(categoryBreakdown)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'none';

    return {
      totalSpent,
      averageDaily,
      mostUsedCategory,
      categoryBreakdown,
    };
  }

  // Reset tokens (for testing/admin)
  async resetTokens(): Promise<void> {
    const balance: TokenBalance = {
      current: 50,
      lifetime: 50,
      lastUpdated: new Date().toISOString(),
    };
    
    await this.saveTokenBalance(balance);
    await AsyncStorage.removeItem(TOKEN_HISTORY_KEY);
  }
}

export const tokenSystem = new TokenSystem(); 