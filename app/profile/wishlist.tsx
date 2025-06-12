import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Image,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { storeWishlist, getWishlist } from '@/utils/storage';
import { router } from 'expo-router';

type WishlistItem = {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  inStock: boolean;
};

const WishlistScreen = () => {
  const { colors } = useTheme();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 16,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
    },
    emptyText: {
      fontSize: 18,
      marginTop: 16,
      marginBottom: 24,
    },
    browseButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
    },
    browseButtonText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: '600',
    },
    itemContainer: {
      flexDirection: 'row',
      padding: 16,
      borderRadius: 8,
      marginBottom: 16,
    },
    itemImage: {
      width: 100,
      height: 100,
      borderRadius: 8,
    },
    itemDetails: {
      flex: 1,
      marginLeft: 16,
    },
    itemBrand: {
      fontSize: 14,
      opacity: 0.7,
    },
    itemName: {
      fontSize: 16,
      fontWeight: '600',
      marginTop: 4,
    },
    priceContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    itemPrice: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    originalPrice: {
      fontSize: 14,
      textDecorationLine: 'line-through',
      opacity: 0.7,
      marginLeft: 8,
    },
    buttonContainer: {
      flexDirection: 'row',
      marginTop: 16,
    },
    moveToCartButton: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 8,
      marginRight: 8,
      alignItems: 'center',
    },
    removeButton: {
      flex: 1,
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      color: colors.background,
      fontSize: 14,
      fontWeight: '600',
    },
  });

  // Load wishlist items on mount
  useEffect(() => {
    const loadWishlist = async () => {
      const savedWishlist = await getWishlist();
      setWishlistItems(savedWishlist);
    };
    loadWishlist();
  }, []);

  const handleRemoveItem = async (id: string) => {
    const newWishlist = wishlistItems.filter(item => item.id !== id);
    setWishlistItems(newWishlist);
    await storeWishlist(newWishlist);
  };

  const handleMoveToCart = async (id: string) => {
    // TODO: Implement move to cart functionality
    await handleRemoveItem(id);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.background === '#000000' ? "light-content" : "dark-content"} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>My Wishlist</Text>
          {wishlistItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="heart-outline" size={64} color={colors.text} />
              <Text style={[styles.emptyText, { color: colors.text }]}>
                Your wishlist is empty
              </Text>
              <TouchableOpacity
                style={[styles.browseButton, { backgroundColor: colors.primary }]}
                onPress={() => router.push('/(tabs)/products')}
              >
                <Text style={styles.browseButtonText}>Browse Products</Text>
              </TouchableOpacity>
            </View>
          ) : (
            wishlistItems.map((item) => (
              <View
                key={item.id}
                style={[styles.itemContainer, { backgroundColor: colors.surface }]}
              >
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={[styles.itemBrand, { color: colors.text }]}>{item.brand}</Text>
                  <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                  <View style={styles.priceContainer}>
                    <Text style={[styles.itemPrice, { color: colors.text }]}>
                      ${item.price}
                    </Text>
                    {item.originalPrice > item.price && (
                      <Text style={[styles.originalPrice, { color: colors.text }]}>
                        ${item.originalPrice}
                      </Text>
                    )}
                  </View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={[
                        styles.moveToCartButton,
                        { backgroundColor: item.inStock ? colors.primary : colors.textSecondary }
                      ]}
                      onPress={() => handleMoveToCart(item.id)}
                      disabled={!item.inStock}
                    >
                      <Text style={[styles.buttonText, { opacity: item.inStock ? 1 : 0.7 }]}>
                        {item.inStock ? 'Move to Cart' : 'Out of Stock'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.removeButton, { backgroundColor: '#FF3B30' }]}
                      onPress={() => handleRemoveItem(item.id)}
                    >
                      <Text style={styles.buttonText}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WishlistScreen; 