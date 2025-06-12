import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { Platform, View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const { width: screenWidth } = Dimensions.get('window');

const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  
  const tabWidth = screenWidth / state.routes.length;
  const circleRadius = 20;

  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: colors.background,
      height: 70 + (Platform.OS === 'ios' ? insets.bottom : 0),
      paddingBottom: Platform.OS === 'ios' ? insets.bottom : 8,
      borderTopWidth: 0.5,
      borderTopColor: colors.border,
      position: 'relative',
    }}>
      {/* Tab buttons */}
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const getIconName = () => {
          switch (route.name) {
            case 'index':
              return 'home-outline';
            case 'products':
              return 'grid-outline';
            case 'cart':
              return 'cart-outline';
            case 'profile':
              return 'person-outline';
            default:
              return 'home-outline';
          }
        };

        const getTitle = () => {
          switch (route.name) {
            case 'index':
              return 'Home';
            case 'products':
              return 'Products';
            case 'cart':
              return 'Cart';
            case 'profile':
              return 'Profile';
            default:
              return 'Home';
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Floating circle for active tab */}
            {isFocused && (
              <View
                style={{
                  position: 'absolute',
                  top: -12,
                  width: circleRadius * 2,
                  height: circleRadius * 2,
                  borderRadius: circleRadius,
                  backgroundColor: colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <Ionicons
                  name={getIconName()}
                  size={20}
                  color={colors.background}
                />
              </View>
            )}
            
            {/* Regular icon for inactive tabs */}
            {!isFocused && (
              <Ionicons
                name={getIconName()}
                size={22}
                color={colors.textSecondary}
                style={{ marginBottom: 4 }}
              />
            )}
            
            {/* Label */}
            <Text
              style={{
                fontSize: 11,
                fontWeight: isFocused ? '600' : '500',
                color: isFocused ? colors.primary : colors.textSecondary,
                marginTop: isFocused ? 16 : 4,
                opacity: isFocused ? 1 : 0.8,
              }}
            >
              {getTitle()}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          title: 'Products',
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}