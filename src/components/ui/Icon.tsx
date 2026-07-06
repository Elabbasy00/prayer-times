// src/components/ui/Icon.tsx
import React from 'react';
import {
  Settings,
  Home,
  User,
  Bell,
  Search,
  PlusCircle,
  LucideIcon,
  Moon,
  Sunset,
  Sunrise,
  Rainbow,
  SunIcon,
  SunDim,
  PhoneOff,
} from 'lucide-react-native';
import { useTheme } from '../../hooks/useTheme';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, color }) => {
  const { colors } = useTheme();
  const iconColor = color || colors.text;

  const iconMap: Record<string, LucideIcon> = {
    home: Home,
    'home-outline': Home,
    settings: Settings,
    'settings-outline': Settings,
    person: User,
    'person-outline': User,
    notifications: Bell,
    'notifications-outline': Bell,
    search: Search,
    'search-outline': Search,
    'add-circle': PlusCircle,
    'add-circle-outline': PlusCircle,
    fajr: Rainbow,
    sunrise: Sunrise,
    dhuhr: SunIcon,
    asr: SunDim,
    maghrib: Sunset,
    isha: Moon,
    phoneOff: PhoneOff,
  };

  const IconComponent = iconMap[name] || Home;

  return <IconComponent size={size} color={iconColor} />;
};

export default Icon;
