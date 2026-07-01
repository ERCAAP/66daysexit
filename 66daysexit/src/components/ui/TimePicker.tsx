import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme';
import Button from './Button';
import Card from './Card';

interface TimePickerProps {
  visible: boolean;
  onConfirm: (time: string) => void;
  onCancel: () => void;
  initialTime?: string;
  title?: string;
}

const TimePicker: React.FC<TimePickerProps> = ({
  visible,
  onConfirm,
  onCancel,
  initialTime = '09:00',
  title = 'Select Time',
}) => {
  const [selectedHour, setSelectedHour] = useState(() => {
    const [hour] = initialTime.split(':');
    return parseInt(hour, 10);
  });
  
  const [selectedMinute, setSelectedMinute] = useState(() => {
    const [, minute] = initialTime.split(':');
    return parseInt(minute, 10);
  });

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  const formatTime = (hour: number, minute: number): string => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };

  const handleConfirm = () => {
    const timeString = formatTime(selectedHour, selectedMinute);
    onConfirm(timeString);
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Card variant="solid" style={styles.pickerCard}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            </View>

            {/* Time Display */}
            <View style={styles.timeDisplay}>
              <Text style={styles.timeText}>
                {formatTime(selectedHour, selectedMinute)}
              </Text>
            </View>

            {/* Time Pickers */}
            <View style={styles.pickersContainer}>
              {/* Hour Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Hour</Text>
                <View style={styles.pickerWrapper}>
                  {hours.map((hour) => (
                    <TouchableOpacity
                      key={hour}
                      style={[
                        styles.pickerItem,
                        selectedHour === hour && styles.selectedItem,
                      ]}
                      onPress={() => setSelectedHour(hour)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          selectedHour === hour && styles.selectedItemText,
                        ]}
                      >
                        {hour.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Separator */}
              <View style={styles.separator}>
                <Text style={styles.separatorText}>:</Text>
              </View>

              {/* Minute Picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>Minute</Text>
                <View style={styles.pickerWrapper}>
                  {minutes.filter(m => m % 5 === 0).map((minute) => (
                    <TouchableOpacity
                      key={minute}
                      style={[
                        styles.pickerItem,
                        selectedMinute === minute && styles.selectedItem,
                      ]}
                      onPress={() => setSelectedMinute(minute)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          selectedMinute === minute && styles.selectedItemText,
                        ]}
                      >
                        {minute.toString().padStart(2, '0')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              <Button
                title="Cancel"
                variant="outline"
                size="medium"
                onPress={onCancel}
                style={styles.actionButton}
              />
              <Button
                title="Confirm"
                variant="primary"
                size="medium"
                onPress={handleConfirm}
                style={styles.actionButton}
              />
            </View>
          </Card>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  container: {
    width: '100%',
    maxWidth: 400,
  },
  pickerCard: {
    padding: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.semibold,
    color: theme.colors.text.primary,
  },
  closeButton: {
    padding: theme.spacing.xs,
  },
  timeDisplay: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
    backgroundColor: theme.colors.surface.glass,
    borderRadius: theme.radius.lg,
  },
  timeText: {
    fontSize: theme.typography.sizes['4xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.primary.start,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  pickersContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.xl,
  },
  pickerColumn: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.medium,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  pickerWrapper: {
    maxHeight: 200,
    backgroundColor: theme.colors.surface.secondary,
    borderRadius: theme.radius.md,
  },
  pickerItem: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.secondary,
  },
  selectedItem: {
    backgroundColor: theme.colors.primary.start,
  },
  pickerItemText: {
    fontSize: theme.typography.sizes.base,
    color: theme.colors.text.primary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  selectedItemText: {
    color: theme.colors.text.inverse,
    fontWeight: theme.typography.weights.bold,
  },
  separator: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    marginTop: theme.spacing.xl,
  },
  separatorText: {
    fontSize: theme.typography.sizes['2xl'],
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  actionButton: {
    flex: 1,
  },
});

export default TimePicker; 