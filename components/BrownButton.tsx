import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';

interface BrownButtonProps {
  title?: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  leftIcon?: string;
  rightIcon?: string;
  iconColor?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
}

const BrownButton: React.FC<BrownButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = true,
  children,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
}) => {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  // Button background color based on variant
  const getBackgroundColor = () => {
    if (disabled) return colors.border; // Using border color as disabled state
    switch (variant) {
      case 'secondary':
        return colors.secondary;
      case 'outline':
      case 'text':
        return 'transparent';
      case 'danger':
        return colors.error || '#DC3545';
      case 'primary':
      default:
        return colors.primary;
    }
  };
  
  // Get text color based on variant
  const getTextColor = () => {
    if (disabled) return colors.textTertiary || colors.textSecondary;
    if (variant === 'outline' || variant === 'text') {
      return variant === 'text' ? colors.primary : colors.primary;
    }
    return colors.background;
  };

  // Get icon color
  const getIconColor = () => {
    if (disabled) return colors.textTertiary || colors.textSecondary;
    return colors.icon || getTextColor();
  };
  
  // Get icon size based on button size
  const getIconSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'large': return 24;
      case 'medium':
      default:
        return 20;
    }
  };
  
  // Button border based on variant
  const getBorder = () => {
    if (variant === 'outline') {
      return {
        borderWidth: 1,
        borderColor: disabled ? colors.border : colors.primary,
      };
    }
    return {};
  };
  
  // Button padding based on size
  const getPadding = () => {
    switch (size) {
      case 'small':
        return { paddingVertical: 8, paddingHorizontal: 16 };
      case 'large':
        return { paddingVertical: 18, paddingHorizontal: 32 };
      case 'medium':
      default:
        return { paddingVertical: 14, paddingHorizontal: 24 };
    }
  };
  
  // Text size based on button size
  const getTextSize = () => {
    switch (size) {
      case 'small':
        return { fontSize: 14 };
      case 'large':
        return { fontSize: 18 };
      case 'medium':
      default:
        return { fontSize: 16 };
    }
  };
  
  const buttonStyles = {
    ...styles.button,
    backgroundColor: getBackgroundColor(),
    ...getBorder(),
    ...getPadding(),
    width: fullWidth ? '100%' as const : undefined,
    opacity: disabled ? 0.6 : 1,
    ...style,
  } as ViewStyle;
  
  const textStyles = {
    ...styles.text,
    color: getTextColor(),
    ...getTextSize(),
    ...textStyle,
  } as TextStyle;
  
  // Button content
  const buttonContent = (
    <>
      {(leftIcon || loading) && (
        <View style={styles.icon}>
          {loading ? (
            <ActivityIndicator 
              color={getTextColor()} 
              size={getIconSize()}
            />
          ) : (
            <Ionicons 
              name={leftIcon as any} 
              size={getIconSize()} 
              color={getIconColor()} 
            />
          )}
        </View>
      )}
      {children || (
        <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
          {title}
        </Text>
      )}
      {rightIcon && !loading && (
        <View style={styles.icon}>
          <Ionicons 
            name={rightIcon as any} 
            size={getIconSize()} 
            color={getIconColor()} 
          />
        </View>
      )}
    </>
  );
  
  return (
    <TouchableOpacity 
      style={buttonStyles}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
    >
      {buttonContent}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    minWidth: 100,
    minHeight: 48,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  text: {
    fontWeight: '600',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  loader: {
    margin: 4,
  },
  icon: {
    marginRight: 8,
  },
});

export default BrownButton;
