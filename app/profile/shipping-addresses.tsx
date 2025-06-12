import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';

type Address = {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
};

const ShippingAddressesScreen = () => {
  const { colors } = useTheme();
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      name: 'Home',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      isDefault: true,
    },
    {
      id: '2',
      name: 'Office',
      street: '456 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'United States',
      isDefault: false,
    },
  ]);

  const handleAddAddress = () => {
    router.push('/profile/add-address' as any);
  };

  const handleEditAddress = (id: string) => {
    router.push(`/profile/edit-address/${id}` as any);
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(address => address.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses(addresses.map(address => ({
      ...address,
      isDefault: address.id === id,
    })));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.background === '#000000' ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {addresses.map((address) => (
          <View 
            key={address.id}
            style={[styles.addressCard, { backgroundColor: colors.surface }]}
          >
            <View style={styles.addressHeader}>
              <View style={styles.addressTitleContainer}>
                <Text style={[styles.addressName, { color: colors.text }]}>{address.name}</Text>
                {address.isDefault && (
                  <View style={[styles.defaultBadge, { backgroundColor: colors.primary }]}>
                    <Text style={[styles.defaultBadgeText, { color: colors.background }]}>Default</Text>
                  </View>
                )}
              </View>
              <View style={styles.addressActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleEditAddress(address.id)}
                >
                  <Ionicons name="pencil" size={20} color={colors.textSecondary} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleDeleteAddress(address.id)}
                >
                  <Ionicons name="trash" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={[styles.addressText, { color: colors.text }]}>{address.street}</Text>
            <Text style={[styles.addressText, { color: colors.text }]}>
              {address.city}, {address.state} {address.zipCode}
            </Text>
            <Text style={[styles.addressText, { color: colors.text }]}>{address.country}</Text>

            {!address.isDefault && (
              <TouchableOpacity 
                style={[styles.setDefaultButton, { borderColor: colors.border }]}
                onPress={() => handleSetDefault(address.id)}
              >
                <Text style={[styles.setDefaultText, { color: colors.text }]}>Set as Default</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

interface Styles {
  container: ViewStyle;
  scrollContent: ViewStyle;
  addressCard: ViewStyle;
  addressHeader: ViewStyle;
  addressTitleContainer: ViewStyle;
  addressName: TextStyle;
  defaultBadge: ViewStyle;
  defaultBadgeText: TextStyle;
  addressActions: ViewStyle;
  actionButton: ViewStyle;
  addressText: TextStyle;
  setDefaultButton: ViewStyle;
  setDefaultText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  addressCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addressTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressName: {
    fontSize: 18,
    fontWeight: '600',
    marginRight: 8,
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  addressActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  addressText: {
    fontSize: 14,
    marginBottom: 4,
  },
  setDefaultButton: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  setDefaultText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ShippingAddressesScreen; 