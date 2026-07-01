import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../src/theme';
import Button from '../src/components/ui/Button';
import Card from '../src/components/ui/Card';
import { useAuthStore } from '../src/stores/authStore';

interface AssessmentAnswer {
  questionId: string;
  value: number | string;
}

interface Question {
  id: string;
  type: 'scale' | 'multiple' | 'goals';
  question: string;
  options?: string[];
  min?: number;
  max?: number;
  unit?: string;
}

const assessmentQuestions: Question[] = [
  {
    id: 'sleep',
    type: 'scale',
    question: 'How many hours do you sleep per night?',
    min: 4,
    max: 12,
    unit: 'hours'
  },
  {
    id: 'exercise',
    type: 'scale',
    question: 'How many times do you exercise per week?',
    min: 0,
    max: 7,
    unit: 'times'
  },
  {
    id: 'water',
    type: 'scale',
    question: 'How many glasses of water do you drink daily?',
    min: 0,
    max: 15,
    unit: 'glasses'
  },
  {
    id: 'screenTime',
    type: 'scale',
    question: 'How many hours do you spend on your phone daily?',
    min: 1,
    max: 16,
    unit: 'hours'
  },
  {
    id: 'stress',
    type: 'multiple',
    question: 'What\'s your current stress level?',
    options: ['Very Low', 'Low', 'Moderate', 'High', 'Very High']
  },
  {
    id: 'goals',
    type: 'goals',
    question: 'What are your main goals? (Select all that apply)',
    options: [
      'Better Sleep',
      'More Exercise',
      'Healthier Diet',
      'Less Screen Time',
      'Reduce Stress',
      'Productivity',
      'Mental Health',
      'Social Life'
    ]
  }
];

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { updateUserProfile, userProfile } = useAuthStore();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

  const currentQuestion = assessmentQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === assessmentQuestions.length - 1;

  const handleScaleAnswer = (value: number) => {
    const newAnswer: AssessmentAnswer = {
      questionId: currentQuestion.id,
      value: value
    };
    
    const updatedAnswers = answers.filter(a => a.questionId !== currentQuestion.id);
    setAnswers([...updatedAnswers, newAnswer]);
  };

  const handleMultipleChoice = (option: string, index: number) => {
    const newAnswer: AssessmentAnswer = {
      questionId: currentQuestion.id,
      value: index
    };
    
    const updatedAnswers = answers.filter(a => a.questionId !== currentQuestion.id);
    setAnswers([...updatedAnswers, newAnswer]);
  };

  const handleGoalToggle = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const getCurrentAnswer = () => {
    if (currentQuestion.id === 'goals') {
      return selectedGoals;
    }
    return answers.find(a => a.questionId === currentQuestion.id);
  };

  const canProceed = () => {
    if (currentQuestion.id === 'goals') {
      return selectedGoals.length > 0;
    }
    return getCurrentAnswer() !== undefined;
  };

  const handleNext = () => {
    if (currentQuestion.id === 'goals') {
      const goalAnswer: AssessmentAnswer = {
        questionId: 'goals',
        value: selectedGoals.join(',')
      };
      const updatedAnswers = answers.filter(a => a.questionId !== 'goals');
      setAnswers([...updatedAnswers, goalAnswer]);
    }

    if (isLastQuestion) {
      handleComplete();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleComplete = async () => {
    // Update user profile with assessment results
    if (userProfile) {
      updateUserProfile({
        hasCompletedOnboarding: true,
        startDate: new Date().toISOString(),
      });
    }

    // Navigate to main app
    router.replace('/(tabs)');
  };

  const renderScaleQuestion = () => {
    const currentAnswer = getCurrentAnswer() as AssessmentAnswer | undefined;
    const selectedValue = currentAnswer?.value as number;

    return (
      <View style={styles.scaleContainer}>
        <View style={styles.scaleValues}>
          {Array.from({ length: (currentQuestion.max! - currentQuestion.min! + 1) }, (_, i) => {
            const value = currentQuestion.min! + i;
            const isSelected = selectedValue === value;
            
            return (
              <TouchableOpacity
                key={value}
                style={[
                  styles.scaleOption,
                  isSelected && styles.scaleOptionSelected
                ]}
                onPress={() => handleScaleAnswer(value)}
              >
                <Text style={[
                  styles.scaleOptionText,
                  isSelected && styles.scaleOptionTextSelected
                ]}>
                  {value}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={styles.scaleUnit}>{currentQuestion.unit}</Text>
      </View>
    );
  };

  const renderMultipleChoice = () => {
    const currentAnswer = getCurrentAnswer() as AssessmentAnswer | undefined;
    const selectedIndex = currentAnswer?.value as number;

    return (
      <View style={styles.optionsContainer}>
        {currentQuestion.options!.map((option, index) => {
          const isSelected = selectedIndex === index;
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionCard,
                isSelected && styles.optionCardSelected
              ]}
              onPress={() => handleMultipleChoice(option, index)}
            >
              <Text style={[
                styles.optionText,
                isSelected && styles.optionTextSelected
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderGoalsSelection = () => {
    return (
      <View style={styles.goalsContainer}>
        {currentQuestion.options!.map((goal, index) => {
          const isSelected = selectedGoals.includes(goal);
          
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.goalCard,
                isSelected && styles.goalCardSelected
              ]}
              onPress={() => handleGoalToggle(goal)}
            >
              <Text style={[
                styles.goalText,
                isSelected && styles.goalTextSelected
              ]}>
                {goal}
              </Text>
              {isSelected && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const renderQuestionContent = () => {
    switch (currentQuestion.type) {
      case 'scale':
        return renderScaleQuestion();
      case 'multiple':
        return renderMultipleChoice();
      case 'goals':
        return renderGoalsSelection();
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={theme.gradients.background.colors as [string, string, ...string[]]}
        style={styles.gradient}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{t('onboarding.assessmentTitle')}</Text>
            <Text style={styles.subtitle}>{t('onboarding.assessmentSubtitle')}</Text>
            
            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { width: `${((currentQuestionIndex + 1) / assessmentQuestions.length) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {currentQuestionIndex + 1} of {assessmentQuestions.length}
              </Text>
            </View>
          </View>

          {/* Question Card */}
          <Card variant="glass" style={styles.questionCard}>
            <Text style={styles.questionText}>
              {currentQuestion.question}
            </Text>
            
            {renderQuestionContent()}
          </Card>

          {/* Navigation */}
          <View style={styles.navigation}>
            {currentQuestionIndex > 0 && (
              <Button
                title={t('common.back')}
                variant="ghost"
                size="large"
                onPress={handleBack}
                style={styles.backButton}
              />
            )}
            
            <Button
              title={isLastQuestion ? t('common.done') : t('common.next')}
              variant="primary"
              size="large"
              fullWidth={currentQuestionIndex === 0}
              disabled={!canProceed()}
              onPress={handleNext}
              style={styles.nextButton}
            />
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing['2xl'],
  },
  header: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.sizes['3xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary.start,
    borderRadius: theme.radius.full,
  },
  progressText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.muted,
  },
  questionCard: {
    marginBottom: theme.spacing.xl,
  },
  questionText: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: theme.typography.lineHeights.relaxed * theme.typography.sizes.xl,
  },
  scaleContainer: {
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  scaleValues: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  scaleOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.surface.secondary,
    borderWidth: 1,
    borderColor: theme.colors.border.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scaleOptionSelected: {
    backgroundColor: theme.colors.primary.start,
    borderColor: theme.colors.primary.start,
  },
  scaleOptionText: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.secondary,
  },
  scaleOptionTextSelected: {
    color: theme.colors.text.inverse,
  },
  scaleUnit: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.muted,
  },
  optionsContainer: {
    gap: theme.spacing.sm,
  },
  optionCard: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
  },
  optionCardSelected: {
    backgroundColor: theme.colors.primary.start,
    borderColor: theme.colors.primary.start,
  },
  optionText: {
    fontSize: theme.typography.sizes.lg,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.weights.semibold,
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    justifyContent: 'center',
  },
  goalCard: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    minWidth: '45%',
    justifyContent: 'center',
  },
  goalCardSelected: {
    backgroundColor: theme.colors.success.start,
    borderColor: theme.colors.success.start,
  },
  goalText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
  goalTextSelected: {
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.weights.semibold,
  },
  checkmark: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.weights.bold,
  },
  navigation: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  backButton: {
    flex: 1,
  },
  nextButton: {
    flex: 2,
  },
}); 