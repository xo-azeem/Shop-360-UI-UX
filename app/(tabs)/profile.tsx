import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getWishlist } from '@/utils/storage';

type MenuItem = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  route: '/profile/personal-info' | '/profile/shipping-addresses' | '/profile/payment-methods' | '/profile/wishlist' | '/profile/orders' | '/profile/notifications' | '/profile/settings' | '/profile/help-support';
};

const ProfileScreen = () => {
  const { colors } = useTheme();
  const { logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [wishlistCount, setWishlistCount] = useState(0);

  useEffect(() => {
    const loadWishlistCount = async () => {
      const wishlist = await getWishlist();
      setWishlistCount(wishlist.length);
    };
    loadWishlistCount();
  }, []);

  const menuItems: MenuItem[] = [
    {
      icon: 'person-outline',
      title: 'Personal Information',
      subtitle: 'Update your profile details',
      route: '/profile/personal-info',
    },
    {
      icon: 'location-outline',
      title: 'Shipping Addresses',
      subtitle: 'Manage your delivery addresses',
      route: '/profile/shipping-addresses',
    },
    {
      icon: 'card-outline',
      title: 'Payment Methods',
      subtitle: 'Manage your payment options',
      route: '/profile/payment-methods',
    },
    {
      icon: 'heart-outline',
      title: 'Wishlist',
      subtitle: 'View your saved items',
      route: '/profile/wishlist',
    },
    {
      icon: 'time-outline',
      title: 'Order History',
      subtitle: 'View your past orders',
      route: '/profile/orders',
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      subtitle: 'Manage your notifications',
      route: '/profile/notifications',
    },
    {
      icon: 'settings-outline',
      title: 'Settings',
      subtitle: 'App preferences and settings',
      route: '/profile/settings',
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      route: '/profile/help-support',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.background === '#000000' ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={16}
      >
        <View style={[styles.header, { paddingTop: 50 }]}>
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop' }}
                style={[styles.profileImage, { borderColor: colors.primary }]}
              />
              <TouchableOpacity 
                style={[styles.cameraButton, { 
                  backgroundColor: colors.primary,
                  borderColor: colors.background 
                }]}
                onPress={() => {}}
              >
                <Ionicons name="camera" size={16} color={colors.background} />
              </TouchableOpacity>
            </View>
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: colors.text }]}>John Doe</Text>
              <Text style={[styles.userEmail, { color: colors.textSecondary }]}>john.doe@example.com</Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.logoutButton, { backgroundColor: colors.surface }]}
          onPress={logout}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={[styles.logoutText, { color: '#FF3B30' }]}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Ionicons name="bag-outline" size={24} color={colors.primary} style={styles.statIcon} />
            <Text style={[styles.statNumber, { color: colors.text }]}>12</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Orders</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Ionicons name="heart-outline" size={24} color={colors.primary} style={styles.statIcon} />
            <Text style={[styles.statNumber, { color: colors.text }]}>{wishlistCount}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Wishlist</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
            <Ionicons name="location-outline" size={24} color={colors.primary} style={styles.statIcon} />
            <Text style={[styles.statNumber, { color: colors.text }]}>2</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Addresses</Text>
          </View>
        </View>

        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.menuItem, { backgroundColor: colors.surface }]}
              onPress={() => router.push(item.route)}
            >
              <View style={styles.menuItemLeft}>
                <View style={[styles.menuIconContainer, { backgroundColor: colors.background }]}>
                  <Ionicons name={item.icon} size={20} color={colors.icon} />
                </View>
                <View style={styles.menuItemText}>
                  <Text style={[styles.menuItemTitle, { color: colors.text }]}>{item.title}</Text>
                  <Text style={[styles.menuItemSubtitle, { color: colors.textSecondary }]}>{item.subtitle}</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    minHeight: '100%',
  },
  header: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  userInfo: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    fontWeight: '400',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 6,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  statIcon: {
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  menuContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 12,
    fontWeight: '400',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 12,
    width: '90%',
    alignSelf: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProfileScreen;