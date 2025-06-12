import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, Platform, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useTheme } from '@/context/ThemeContext';

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  onQuantityChange: (id: string, newQuantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem = ({ id, name, price, image, quantity, onQuantityChange, onRemove }: CartItemProps) => {
  const { colors } = useTheme();
  
  return (
    <View style={[styles.cartItem, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Image source={{ uri: image }} style={styles.cartItemImage} />
      <View style={styles.cartItemInfo}>
        <ThemedText style={[styles.cartItemName, { color: colors.text }]}>{name}</ThemedText>
        <ThemedText style={[styles.cartItemPrice, { color: colors.text }]}>${price.toFixed(2)}</ThemedText>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={[styles.quantityButton, { backgroundColor: colors.primary }]}
            onPress={() => onQuantityChange(id, Math.max(1, quantity - 1))}
          >
            <MaterialIcons name="remove" size={20} color={colors.background} />
          </TouchableOpacity>
          <ThemedText style={[styles.quantityText, { color: colors.text }]}>{quantity}</ThemedText>
          <TouchableOpacity 
            style={[styles.quantityButton, { backgroundColor: colors.primary }]}
            onPress={() => onQuantityChange(id, quantity + 1)}
          >
            <MaterialIcons name="add" size={20} color={colors.background} />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => onRemove(id)}
      >
        <MaterialIcons name="delete-outline" size={24} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );
};

export default function CartScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'Wireless Headphones',
      price: 129.99,
      image: 'https://pcstore.pk/wp-content/uploads/2024/01/Sony-WH-CH520-Wireless-Headphones-with-Microphone-_price-in-pakistan-Black-img1-min.png',
      quantity: 1,
    },
    {
      id: '2',
      name: 'Smart Watch',
      price: 249.99,
      image: 'https://images.samsung.com/is/image/samsung/p6pim/pk/sm-l310nzg8eua/gallery/pk-galaxy-watch7-l310-sm-l310nzg8eua-thumb-544769007?$UX_EXT2_PNG$',
      quantity: 1,
    },
  ]);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 10;
  const total = subtotal + shipping;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor={colors.background} 
        translucent={false}
      />
      <View style={[styles.header, { paddingTop: insets.top + 16, backgroundColor: colors.background }]}>
        <ThemedText style={[styles.headerTitle, { color: colors.text }]}>Shopping Cart</ThemedText>
        <ThemedText style={[styles.itemCount, { color: colors.textSecondary }]}>{cartItems.length} items</ThemedText>
      </View>

      <ScrollView 
        style={styles.cartList} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.cartListContent}
      >
        {cartItems.map(item => (
          <CartItem
            key={item.id}
            {...item}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemoveItem}
          />
        ))}
      </ScrollView>

      <View style={[styles.summaryContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
        <View style={styles.summaryRow}>
          <ThemedText style={[styles.summaryLabel, { color: colors.textSecondary }]}>Subtotal</ThemedText>
          <ThemedText style={[styles.summaryValue, { color: colors.text }]}>${subtotal.toFixed(2)}</ThemedText>
        </View>
        <View style={styles.summaryRow}>
          <ThemedText style={[styles.summaryLabel, { color: colors.textSecondary }]}>Shipping</ThemedText>
          <ThemedText style={[styles.summaryValue, { color: colors.text }]}>${shipping.toFixed(2)}</ThemedText>
        </View>
        <View style={[styles.summaryRow, styles.totalRow, { borderTopColor: colors.border }]}>
          <ThemedText style={[styles.totalLabel, { color: colors.text }]}>Total</ThemedText>
          <ThemedText style={[styles.totalValue, { color: colors.text }]}>${total.toFixed(2)}</ThemedText>
        </View>

        <TouchableOpacity 
          style={[styles.checkoutButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push('/(tabs)')}
        >
          <ThemedText style={[styles.checkoutButtonText, { color: colors.background }]}>Proceed to Checkout</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemCount: {
    fontSize: 14,
  },
  cartList: {
    flex: 1,
  },
  cartListContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  cartItem: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cartItemImage: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
  cartItemInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  cartItemName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 15,
    marginBottom: 8,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  quantityText: {
    fontSize: 15,
    marginHorizontal: 12,
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  summaryContainer: {
    borderTopWidth: 1,
    padding: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 15,
  },
  summaryValue: {
    fontSize: 15,
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 17,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '600',
  },
  checkoutButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  checkoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});