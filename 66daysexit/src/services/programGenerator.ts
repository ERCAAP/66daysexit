interface AssessmentData {
  sleep: number;
  exercise: number;
  water: number;
  screenTime: number;
  stress: number;
  goals: string[];
}

interface DailyTask {
  id: string;
  title: string;
  description: string;
  category: 'sleep' | 'water' | 'exercise' | 'mind' | 'screenTime' | 'shower';
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  timeEstimate: string;
  week: number;
  isCompleted: boolean;
}

interface WeeklyProgram {
  week: number;
  theme: string;
  description: string;
  tasks: DailyTask[];
}

interface UserProgram {
  userId: string;
  startDate: string;
  currentDay: number;
  weeklyPrograms: WeeklyProgram[];
  totalXP: number;
  level: number;
  streak: number;
}

interface TaskTemplate {
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xp: number;
}

class ProgramGenerator {
  private sleepTasks = {
    week1: [
      { title: "Set a consistent bedtime", description: "Choose a bedtime and stick to it for 3 days", difficulty: "easy" as const, xp: 10 },
      { title: "No screens 30min before bed", description: "Put devices away 30 minutes before bedtime", difficulty: "medium" as const, xp: 15 },
      { title: "Create bedtime ritual", description: "Develop a calming 10-minute bedtime routine", difficulty: "easy" as const, xp: 10 },
    ],
    week2: [
      { title: "Sleep diary tracking", description: "Track your sleep quality and duration for 7 days", difficulty: "easy" as const, xp: 20 },
      { title: "No caffeine after 2pm", description: "Avoid caffeine in the afternoon and evening", difficulty: "medium" as const, xp: 15 },
      { title: "Dark room setup", description: "Make your bedroom as dark as possible", difficulty: "easy" as const, xp: 10 },
    ],
  };

  private exerciseTasks = {
    week1: [
      { title: "5-minute morning stretch", description: "Do basic stretches every morning", difficulty: "easy" as const, xp: 10 },
      { title: "Take stairs instead of elevator", description: "Choose stairs whenever possible", difficulty: "easy" as const, xp: 5 },
      { title: "10-minute walk", description: "Take a 10-minute walk outside", difficulty: "easy" as const, xp: 10 },
    ],
    week2: [
      { title: "15-minute workout", description: "Complete a basic bodyweight workout", difficulty: "medium" as const, xp: 20 },
      { title: "Active transport", description: "Walk or bike for short trips", difficulty: "medium" as const, xp: 15 },
      { title: "Yoga session", description: "Follow a 20-minute yoga video", difficulty: "medium" as const, xp: 20 },
    ],
  };

  private waterTasks = {
    week1: [
      { title: "Drink water upon waking", description: "Have a glass of water first thing in the morning", difficulty: "easy" as const, xp: 5 },
      { title: "Water bottle tracking", description: "Fill and finish a water bottle", difficulty: "easy" as const, xp: 10 },
      { title: "Replace one sugary drink", description: "Substitute one soda/juice with water", difficulty: "medium" as const, xp: 15 },
    ],
    week2: [
      { title: "Hydration reminders", description: "Set hourly water reminders", difficulty: "easy" as const, xp: 10 },
      { title: "Electrolyte balance", description: "Add lemon or cucumber to your water", difficulty: "easy" as const, xp: 5 },
      { title: "Pre-meal hydration", description: "Drink water 30 minutes before meals", difficulty: "medium" as const, xp: 15 },
    ],
  };

  private mindTasks = {
    week1: [
      { title: "5-minute meditation", description: "Practice mindfulness meditation", difficulty: "easy" as const, xp: 15 },
      { title: "Gratitude journal", description: "Write down 3 things you're grateful for", difficulty: "easy" as const, xp: 10 },
      { title: "Deep breathing exercise", description: "Practice 4-7-8 breathing technique", difficulty: "easy" as const, xp: 10 },
    ],
    week2: [
      { title: "10-minute meditation", description: "Extend your meditation practice", difficulty: "medium" as const, xp: 20 },
      { title: "Mindful walking", description: "Take a 15-minute mindful walk", difficulty: "easy" as const, xp: 15 },
      { title: "Stress reflection", description: "Journal about stress triggers", difficulty: "medium" as const, xp: 15 },
    ],
  };

  private screenTimeTasks = {
    week1: [
      { title: "Phone-free meals", description: "Eat one meal without looking at your phone", difficulty: "medium" as const, xp: 15 },
      { title: "App usage check", description: "Review your daily screen time report", difficulty: "easy" as const, xp: 5 },
      { title: "Digital sunset", description: "No screens 1 hour before bed", difficulty: "hard" as const, xp: 25 },
    ],
    week2: [
      { title: "App limits setup", description: "Set time limits on social media apps", difficulty: "medium" as const, xp: 20 },
      { title: "Phone-free morning", description: "Start day without checking phone for 1 hour", difficulty: "hard" as const, xp: 25 },
      { title: "Digital detox hour", description: "One hour completely device-free", difficulty: "medium" as const, xp: 20 },
    ],
  };

  private showerTasks = {
    week1: [
      { title: "Cold shower finish", description: "End your shower with 30 seconds of cold water", difficulty: "hard" as const, xp: 20 },
      { title: "Mindful shower", description: "Practice mindfulness during your shower", difficulty: "easy" as const, xp: 10 },
      { title: "Morning energy shower", description: "Take a refreshing morning shower", difficulty: "easy" as const, xp: 5 },
    ],
    week2: [
      { title: "1-minute cold shower", description: "Extend cold exposure to 1 minute", difficulty: "hard" as const, xp: 30 },
      { title: "Shower meditation", description: "Use shower time for gratitude meditation", difficulty: "medium" as const, xp: 15 },
      { title: "Temperature contrast", description: "Alternate between hot and cold water", difficulty: "hard" as const, xp: 25 },
    ],
  };

  generateProgram(assessmentData: AssessmentData, userId: string): UserProgram {
    const weeklyPrograms: WeeklyProgram[] = [];
    
    // Analyze assessment data to determine focus areas
    const focusAreas = this.analyzeFocusAreas(assessmentData);
    
    // Generate 10 weeks of progressively challenging tasks (66 days ≈ 9.5 weeks)
    for (let week = 1; week <= 10; week++) {
      const weekProgram = this.generateWeekProgram(week, focusAreas, assessmentData);
      weeklyPrograms.push(weekProgram);
    }

    return {
      userId,
      startDate: new Date().toISOString(),
      currentDay: 1,
      weeklyPrograms,
      totalXP: 0,
      level: 1,
      streak: 0,
    };
  }

  private analyzeFocusAreas(data: AssessmentData): string[] {
    const focusAreas: string[] = [];
    
    // Sleep analysis
    if (data.sleep < 7) {
      focusAreas.push('sleep');
    }
    
    // Exercise analysis
    if (data.exercise < 3) {
      focusAreas.push('exercise');
    }
    
    // Water analysis
    if (data.water < 8) {
      focusAreas.push('water');
    }
    
    // Screen time analysis
    if (data.screenTime > 6) {
      focusAreas.push('screenTime');
    }
    
    // Stress analysis
    if (data.stress >= 3) {
      focusAreas.push('mind');
    }
    
    // Always include shower for discipline building
    focusAreas.push('shower');
    
    // Include goals-based focus areas
    if (data.goals.includes('Better Sleep')) focusAreas.push('sleep');
    if (data.goals.includes('More Exercise')) focusAreas.push('exercise');
    if (data.goals.includes('Less Screen Time')) focusAreas.push('screenTime');
    if (data.goals.includes('Reduce Stress')) focusAreas.push('mind');
    
    return [...new Set(focusAreas)]; // Remove duplicates
  }

  private generateWeekProgram(week: number, focusAreas: string[], assessmentData: AssessmentData): WeeklyProgram {
    const weekThemes = {
      1: "Foundation Building",
      2: "Habit Formation", 
      3: "Consistency Development",
      4: "Challenge Introduction",
      5: "Momentum Building",
      6: "Advanced Integration",
      7: "Mastery Focus",
      8: "Optimization",
      9: "Excellence Pursuit",
      10: "Life Integration"
    };

    const tasks: DailyTask[] = [];
    let taskId = 1;

    // Generate daily tasks for each focus area
    focusAreas.forEach(area => {
      const areaTasks = this.getTasksForArea(area, week, assessmentData);
      areaTasks.forEach((task: TaskTemplate) => {
        tasks.push({
          id: `w${week}_${area}_${taskId++}`,
          title: task.title,
          description: task.description,
          category: area as any,
          difficulty: task.difficulty,
          xpReward: task.xp,
          timeEstimate: this.getTimeEstimate(task.difficulty),
          week,
          isCompleted: false,
        });
      });
    });

    return {
      week,
      theme: weekThemes[week as keyof typeof weekThemes] || "Transformation",
      description: this.getWeekDescription(week),
      tasks,
    };
  }

  private getTasksForArea(area: string, week: number, assessmentData: AssessmentData): TaskTemplate[] {
    const weekKey = `week${Math.min(week, 2)}` as 'week1' | 'week2';
    
    switch (area) {
      case 'sleep':
        return this.sleepTasks[weekKey] || this.sleepTasks.week1;
      case 'exercise':
        return this.exerciseTasks[weekKey] || this.exerciseTasks.week1;
      case 'water':
        return this.waterTasks[weekKey] || this.waterTasks.week1;
      case 'mind':
        return this.mindTasks[weekKey] || this.mindTasks.week1;
      case 'screenTime':
        return this.screenTimeTasks[weekKey] || this.screenTimeTasks.week1;
      case 'shower':
        return this.showerTasks[weekKey] || this.showerTasks.week1;
      default:
        return [];
    }
  }

  private getTimeEstimate(difficulty: string): string {
    switch (difficulty) {
      case 'easy': return '2-5 min';
      case 'medium': return '10-15 min';
      case 'hard': return '20-30 min';
      default: return '5-10 min';
    }
  }

  private getWeekDescription(week: number): string {
    const descriptions = {
      1: "Start small and build the foundation for lasting change",
      2: "Focus on consistency and making habits stick",
      3: "Develop reliable patterns and routines",
      4: "Introduce more challenging aspects to your routine",
      5: "Build momentum with increased complexity",
      6: "Integrate advanced techniques and strategies",
      7: "Master your routines with precision",
      8: "Optimize and fine-tune your habits",
      9: "Pursue excellence in all areas",
      10: "Integrate everything into your new lifestyle"
    };
    
    return descriptions[week as keyof typeof descriptions] || "Continue your transformation journey";
  }

  calculateLevel(totalXP: number): number {
    // XP requirements: Level 1=0, Level 2=100, Level 3=250, Level 4=450, etc.
    // Formula: XP needed = level^2 * 50 - 50
    let level = 1;
    let xpRequired = 0;
    
    while (totalXP >= xpRequired) {
      level++;
      xpRequired = Math.pow(level, 2) * 50 - 50;
    }
    
    return level - 1;
  }

  getXPForNextLevel(currentLevel: number): number {
    return Math.pow(currentLevel + 1, 2) * 50 - 50;
  }

  getCurrentWeekTasks(program: UserProgram): DailyTask[] {
    const currentWeek = Math.ceil(program.currentDay / 7);
    const weekProgram = program.weeklyPrograms.find(w => w.week === currentWeek);
    return weekProgram?.tasks || [];
  }

  getTodaysTasks(program: UserProgram): DailyTask[] {
    const currentWeekTasks = this.getCurrentWeekTasks(program);
    const dayInWeek = ((program.currentDay - 1) % 7) + 1;
    
    // Return 2-4 tasks per day, distributed across categories
    const tasksPerDay = Math.ceil(currentWeekTasks.length / 7);
    const startIndex = (dayInWeek - 1) * tasksPerDay;
    const endIndex = Math.min(startIndex + tasksPerDay, currentWeekTasks.length);
    
    return currentWeekTasks.slice(startIndex, endIndex);
  }
}

export const programGenerator = new ProgramGenerator();
export type { AssessmentData, DailyTask, WeeklyProgram, UserProgram }; 