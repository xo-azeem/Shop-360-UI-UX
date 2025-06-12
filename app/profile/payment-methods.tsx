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

type PaymentMethod = {
  id: string;
  type: 'card';
  cardType: 'visa' | 'mastercard' | 'amex';
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  isDefault: boolean;
};

const PaymentMethodsScreen = () => {
  const { colors } = useTheme();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      cardType: 'visa',
      last4: '4242',
      expiryMonth: '12',
      expiryYear: '24',
      isDefault: true,
    },
    {
      id: '2',
      type: 'card',
      cardType: 'mastercard',
      last4: '5555',
      expiryMonth: '09',
      expiryYear: '25',
      isDefault: false,
    },
  ]);

  const handleAddPaymentMethod = () => {
    router.push('/profile/payment-methods/add' as any);
  };

  const handleDeletePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter(method => method.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id,
    })));
  };

  const getCardIcon = (cardType: string): keyof typeof Ionicons.glyphMap => {
    switch (cardType) {
      case 'visa':
        return 'card-outline';
      case 'mastercard':
        return 'card-outline';
      case 'amex':
        return 'card-outline';
      default:
        return 'card-outline';
    }
  };

  const getCardColor = (cardType: string) => {
    switch (cardType) {
      case 'visa':
        return '#1A1F71';
      case 'mastercard':
        return '#EB001B';
      case 'amex':
        return '#006FCF';
      default:
        return colors.primary;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.background === '#000000' ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {paymentMethods.map((method) => (
          <View 
            key={method.id}
            style={[styles.cardContainer, { backgroundColor: colors.surface }]}
          >
            <View style={styles.cardHeader}>
              <View style={styles.cardInfo}>
                <View style={[styles.cardIconContainer, { backgroundColor: getCardColor(method.cardType) }]}>
                  <Ionicons name={getCardIcon(method.cardType)} size={24} color="#FFF" />
                </View>
                <View>
                  <Text style={[styles.cardType, { color: colors.text }]}>
                    {method.cardType.charAt(0).toUpperCase() + method.cardType.slice(1)}
                  </Text>
                  <Text style={[styles.cardNumber, { color: colors.textSecondary }]}>
                    •••• {method.last4}
                  </Text>
                </View>
              </View>
              {method.isDefault && (
                <View style={[styles.defaultBadge, { backgroundColor: colors.primary }]}>
                  <Text style={[styles.defaultBadgeText, { color: colors.background }]}>Default</Text>
                </View>
              )}
            </View>

            <View style={styles.cardDetails}>
              <Text style={[styles.expiryText, { color: colors.textSecondary }]}>
                Expires {method.expiryMonth}/{method.expiryYear}
              </Text>
              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDeletePaymentMethod(method.id)}
              >
                <Ionicons name="trash" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>

            {!method.isDefault && (
              <TouchableOpacity 
                style={[styles.setDefaultButton, { borderColor: colors.border }]}
                onPress={() => handleSetDefault(method.id)}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  } as ViewStyle,
  scrollContent: {
    padding: 20,
  } as ViewStyle,
  cardContainer: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  } as ViewStyle,
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  } as ViewStyle,
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  } as ViewStyle,
  cardType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  } as TextStyle,
  cardNumber: {
    fontSize: 14,
  } as TextStyle,
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  } as ViewStyle,
  defaultBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  } as TextStyle,
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  expiryText: {
    fontSize: 14,
  } as TextStyle,
  deleteButton: {
    padding: 8,
  } as ViewStyle,
  setDefaultButton: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  } as ViewStyle,
  setDefaultText: {
    fontSize: 14,
    fontWeight: '600',
  } as TextStyle,
});

export default PaymentMethodsScreen; 