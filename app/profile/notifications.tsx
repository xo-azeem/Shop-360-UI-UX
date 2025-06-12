import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';

type NotificationPreference = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

const NotificationsScreen = () => {
  const { colors } = useTheme();
  const [preferences, setPreferences] = useState<NotificationPreference[]>([
    {
      id: '1',
      title: 'Order Updates',
      description: 'Get notified about your order status and delivery updates',
      enabled: true,
    },
    {
      id: '2',
      title: 'Promotions & Deals',
      description: 'Receive notifications about special offers and discounts',
      enabled: true,
    },
    {
      id: '3',
      title: 'New Arrivals',
      description: 'Be the first to know about new products in your favorite categories',
      enabled: false,
    },
    {
      id: '4',
      title: 'Price Drops',
      description: 'Get alerts when items in your wishlist go on sale',
      enabled: true,
    },
    {
      id: '5',
      title: 'Back in Stock',
      description: 'Receive notifications when out-of-stock items become available',
      enabled: false,
    },
    {
      id: '6',
      title: 'Account Security',
      description: 'Get notified about important security updates and login attempts',
      enabled: true,
    },
  ]);

  const handleTogglePreference = (id: string) => {
    setPreferences(preferences.map(pref => 
      pref.id === id ? { ...pref, enabled: !pref.enabled } : pref
    ));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.background === '#000000' ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Push Notifications</Text>
          </View>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Choose what you want to be notified about
          </Text>
        </View>

        <View style={styles.preferencesContainer}>
          {preferences.map((preference) => (
            <View 
              key={preference.id}
              style={[styles.preferenceItem, { backgroundColor: colors.surface }]}
            >
              <View style={styles.preferenceInfo}>
                <Text style={[styles.preferenceTitle, { color: colors.text }]}>
                  {preference.title}
                </Text>
                <Text style={[styles.preferenceDescription, { color: colors.textSecondary }]}>
                  {preference.description}
                </Text>
              </View>
              <Switch
                value={preference.enabled}
                onValueChange={() => handleTogglePreference(preference.id)}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFF"
              />
            </View>
          ))}
        </View>

        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Ionicons name="mail-outline" size={24} color={colors.text} />
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Email Notifications</Text>
          </View>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Manage your email notification preferences
          </Text>
          <TouchableOpacity 
            style={[styles.emailButton, { borderColor: colors.border }]}
            onPress={() => {}}
          >
            <Text style={[styles.emailButtonText, { color: colors.text }]}>
              Manage Email Preferences
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  sectionDescription: {
    fontSize: 14,
    marginLeft: 36,
  },
  preferencesContainer: {
    gap: 12,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
  },
  preferenceInfo: {
    flex: 1,
    marginRight: 16,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 14,
  },
  emailButton: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  emailButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  header: undefined,
  backButton: undefined,
  headerTitle: undefined,
  placeholder: undefined,
});

export default NotificationsScreen; 