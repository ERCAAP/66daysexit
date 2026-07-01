import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Line, Rect, Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { theme } from '../../theme';

const { width: screenWidth } = Dimensions.get('window');

interface ChartProps {
  data: number[];
  width?: number;
  height?: number;
  showLabels?: boolean;
  color?: 'primary' | 'secondary' | 'success' | 'warning';
}

interface LineChartProps extends ChartProps {
  labels?: string[];
  showGrid?: boolean;
}

interface BarChartProps extends ChartProps {
  labels?: string[];
  maxValue?: number;
}

interface RadialChartProps {
  data: { label: string; value: number; color?: string }[];
  size?: number;
  strokeWidth?: number;
}

// Line Chart Component
export const LineChart: React.FC<LineChartProps> = ({
  data,
  labels,
  width = screenWidth - 40,
  height = 200,
  showGrid = true,
  showLabels = true,
  color = 'primary',
}) => {
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const valueRange = maxValue - minValue || 1;
  
  const getGradientId = () => `line-gradient-${color}`;
  
  const getGradientColors = () => {
    switch (color) {
      case 'primary':
        return [theme.colors.primary.start, theme.colors.primary.end];
      case 'secondary':
        return [theme.colors.secondary.start, theme.colors.secondary.end];
      case 'success':
        return [theme.colors.success.start, theme.colors.success.end];
      case 'warning':
        return [theme.colors.warning.start, theme.colors.warning.end];
      default:
        return [theme.colors.primary.start, theme.colors.primary.end];
    }
  };

  const points = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + ((maxValue - value) / valueRange) * chartHeight;
    return { x, y };
  });

  const pathData = points.reduce((path, point, index) => {
    const command = index === 0 ? 'M' : 'L';
    return `${path} ${command} ${point.x} ${point.y}`;
  }, '');

  const areaPathData = `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${padding} ${height - padding} Z`;

  const gradientColors = getGradientColors();

  return (
    <View style={styles.chartContainer}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id={getGradientId()} x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={gradientColors[0]} stopOpacity="0.3" />
            <Stop offset="100%" stopColor={gradientColors[1]} stopOpacity="0.1" />
          </LinearGradient>
        </Defs>
        
        {/* Grid lines */}
        {showGrid && (
          <>
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
              <Line
                key={`h-grid-${index}`}
                x1={padding}
                y1={padding + ratio * chartHeight}
                x2={width - padding}
                y2={padding + ratio * chartHeight}
                stroke={theme.colors.border.secondary}
                strokeWidth={1}
                strokeOpacity={0.5}
              />
            ))}
          </>
        )}
        
        {/* Area under curve */}
        <Path
          d={areaPathData}
          fill={`url(#${getGradientId()})`}
        />
        
        {/* Line */}
        <Path
          d={pathData}
          fill="none"
          stroke={gradientColors[0]}
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {points.map((point, index) => (
          <Circle
            key={index}
            cx={point.x}
            cy={point.y}
            r={4}
            fill={gradientColors[0]}
            stroke={theme.colors.background.primary}
            strokeWidth={2}
          />
        ))}
      </Svg>
      
      {/* Labels */}
      {showLabels && labels && (
        <View style={styles.labelsContainer}>
          {labels.map((label, index) => (
            <Text key={index} style={styles.label}>
              {label}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

// Bar Chart Component
export const BarChart: React.FC<BarChartProps> = ({
  data,
  labels,
  width = screenWidth - 40,
  height = 200,
  showLabels = true,
  color = 'primary',
  maxValue,
}) => {
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const max = maxValue || Math.max(...data);
  const barWidth = chartWidth / data.length * 0.6;
  const barSpacing = chartWidth / data.length * 0.4;
  
  const getGradientId = () => `bar-gradient-${color}`;
  
  const getGradientColors = () => {
    switch (color) {
      case 'primary':
        return [theme.colors.primary.start, theme.colors.primary.end];
      case 'secondary':
        return [theme.colors.secondary.start, theme.colors.secondary.end];
      case 'success':
        return [theme.colors.success.start, theme.colors.success.end];
      case 'warning':
        return [theme.colors.warning.start, theme.colors.warning.end];
      default:
        return [theme.colors.primary.start, theme.colors.primary.end];
    }
  };

  const gradientColors = getGradientColors();

  return (
    <View style={styles.chartContainer}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id={getGradientId()} x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor={gradientColors[0]} />
            <Stop offset="100%" stopColor={gradientColors[1]} />
          </LinearGradient>
        </Defs>
        
        {data.map((value, index) => {
          const barHeight = (value / max) * chartHeight;
          const x = padding + index * (barWidth + barSpacing) + barSpacing / 2;
          const y = padding + chartHeight - barHeight;
          
          return (
            <Rect
              key={index}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={`url(#${getGradientId()})`}
              rx={4}
            />
          );
        })}
      </Svg>
      
      {/* Labels */}
      {showLabels && labels && (
        <View style={styles.barLabelsContainer}>
          {labels.map((label, index) => {
            const x = padding + index * (barWidth + barSpacing) + barSpacing / 2 + barWidth / 2;
            return (
              <Text
                key={index}
                style={[styles.barLabel, { left: x - 20, width: 40 }]}
              >
                {label}
              </Text>
            );
          })}
        </View>
      )}
    </View>
  );
};

// Radial Chart Component (Donut Chart)
export const RadialChart: React.FC<RadialChartProps> = ({
  data,
  size = 120,
  strokeWidth = 20,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const centerX = size / 2;
  const centerY = size / 2;
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  let cumulativePercentage = 0;
  
  return (
    <View style={[styles.radialContainer, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={centerX}
          cy={centerY}
          r={radius}
          stroke={theme.colors.surface.secondary}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Data segments */}
        {data.map((item, index) => {
          const percentage = item.value / total;
          const strokeDasharray = `${percentage * circumference} ${circumference}`;
          const strokeDashoffset = -cumulativePercentage * circumference;
          
          cumulativePercentage += percentage;
          
          const segmentColor = item.color || theme.colors.primary.start;
          
          return (
            <Circle
              key={index}
              cx={centerX}
              cy={centerY}
              r={radius}
              stroke={segmentColor}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              fill="transparent"
              strokeLinecap="round"
              transform={`rotate(-90 ${centerX} ${centerY})`}
            />
          );
        })}
      </Svg>
      
      {/* Center content */}
      <View style={styles.radialCenter}>
        <Text style={styles.radialTotal}>{total}</Text>
        <Text style={styles.radialLabel}>Total</Text>
      </View>
    </View>
  );
};

// Progress Ring Component
export const ProgressRing: React.FC<{
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
}> = ({
  progress,
  size = 100,
  strokeWidth = 8,
  color = theme.colors.primary.start,
  backgroundColor = theme.colors.surface.secondary,
  children,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  return (
    <View style={[styles.progressRing, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      
      {children && (
        <View style={styles.progressRingCenter}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    position: 'relative',
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    marginTop: 8,
  },
  label: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  barLabelsContainer: {
    position: 'relative',
    height: 20,
    marginTop: 8,
  },
  barLabel: {
    position: 'absolute',
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text.muted,
    textAlign: 'center',
  },
  radialContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radialCenter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radialTotal: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text.primary,
  },
  radialLabel: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  progressRing: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressRingCenter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 