import { Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function ProfileLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen
        name="personal-info"
        options={{
          title: 'Personal Information',
        }}
      />
      <Stack.Screen
        name="shipping-addresses"
        options={{
          title: 'Shipping Addresses',
        }}
      />
      <Stack.Screen
        name="payment-methods"
        options={{
          title: 'Payment Methods',
        }}
      />
      <Stack.Screen
        name="wishlist"
        options={{
          title: 'Wishlist',
        }}
      />
      <Stack.Screen
        name="orders"
        options={{
          title: 'Order History',
        }}
      />
      <Stack.Screen
        name="notifications"
        options={{
          title: 'Notifications',
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
      <Stack.Screen
        name="help-support"
        options={{
          title: 'Help Support',
        }}
      />
    </Stack>
  );
} 