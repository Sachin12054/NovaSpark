import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors, Spacing } from '../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'emerald' | 'secondary' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return '#1e293b';
    switch (variant) {
      case 'emerald':
        return Colors.emerald;
      case 'secondary':
        return Colors.surfaceLight;
      case 'ghost':
        return 'transparent';
      case 'primary':
      default:
        return Colors.primary;
    }
  };

  const getTextColor = () => {
    if (disabled) return '#64748b';
    switch (variant) {
      case 'secondary':
      case 'ghost':
        return Colors.text;
      case 'emerald':
      case 'primary':
      default:
        return '#ffffff';
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        variant === 'secondary' && styles.secondaryBorder,
        variant === 'ghost' && styles.ghostBorder,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  secondaryBorder: {
    borderWidth: 1,
    borderColor: Colors.surfaceBorder,
  },
  ghostBorder: {
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  text: {
    fontSize: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
});
