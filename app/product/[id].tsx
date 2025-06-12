import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Animated,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { storeWishlist, getWishlist } from '@/utils/storage';

// Define the Product type
interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description: string;
  thumbnail: string;
  images: string[];
  rating: number;
  discountPercentage: number;
  stock: number;
  brand: string;
}

type WishlistItem = {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  image: string;
  inStock: boolean;
};

const { width } = Dimensions.get('window');

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams();
  const { colors, isDark } = useTheme();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    fetchProduct();
    checkWishlistStatus();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`https://dummyjson.com/products/${id}`);
      const data = await response.json();
      
      if (data) {
        setProduct(data);
      } else {
        setError('Product not found');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to load product. Please try again.');
      setLoading(false);
    }
  };

  const checkWishlistStatus = async () => {
    const wishlist = await getWishlist();
    setIsWishlisted(wishlist.some((item: WishlistItem) => item.id === id));
  };

  const toggleWishlist = async () => {
    const wishlist = await getWishlist();
    if (isWishlisted) {
      // Remove from wishlist
      const newWishlist = wishlist.filter((item: WishlistItem) => item.id !== id);
      await storeWishlist(newWishlist);
      setIsWishlisted(false);
    } else if (product) {
      // Add to wishlist
      const newItem: WishlistItem = {
        id: product.id.toString(),
        name: product.title,
        brand: product.brand,
        price: product.price,
        originalPrice: product.price * 1.2, // 20% higher as original price
        image: product.images[0],
        inStock: product.stock > 0,
      };
      await storeWishlist([...wishlist, newItem]);
      setIsWishlisted(true);
    }
  };

  const changeImage = (direction: 'next' | 'prev') => {
    if (!product) return;

    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    if (direction === 'next' && activeImage < product.images.length - 1) {
      setActiveImage(activeImage + 1);
    } else if (direction === 'prev' && activeImage > 0) {
      setActiveImage(activeImage - 1);
    }
  };

  if (loading) {
    return (
      <View style={[styles.centeredContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading product...</Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={[styles.centeredContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle-outline" size={64} color={colors.textSecondary} />
        <Text style={[styles.errorText, { color: colors.text }]}>{error || 'Product not found'}</Text>
        <TouchableOpacity 
          style={[styles.backButton, { backgroundColor: colors.surface }]} 
          onPress={() => router.back()}
        >
          <Text style={[styles.backButtonText, { color: colors.text }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      {/* Custom Header */}
      <View style={[styles.customHeader, { backgroundColor: colors.background }]}>
        <TouchableOpacity 
          style={[styles.headerButton, { backgroundColor: colors.surface }]} 
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        
        <Text 
          style={[styles.headerTitle, { color: colors.text }]} 
          numberOfLines={1}
        >
          {product.title}
        </Text>
        
        <TouchableOpacity 
          style={[styles.headerButton, { backgroundColor: colors.surface }]}
          onPress={toggleWishlist}
        >
          <Ionicons 
            name={isWishlisted ? "heart" : "heart-outline"} 
            size={24} 
            color={isWishlisted ? colors.primary : colors.text} 
          />
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.imageGallery, { backgroundColor: colors.surface }]}>
          <Animated.Image
            source={{ uri: product.images[activeImage] || product.thumbnail }}
            style={[styles.mainImage, { opacity: fadeAnim }]}
            resizeMode="cover"
          />
          {product.discountPercentage > 0 && (
            <View style={[styles.discountBadge, { backgroundColor: colors.primary }]}>
              <Text style={[styles.discountText, { color: colors.background }]}>
                {Math.round(product.discountPercentage)}% OFF
              </Text>
            </View>
          )}
          
          <TouchableOpacity 
            style={[styles.fullScreenButton, { backgroundColor: colors.surface }]}
            onPress={() => setIsFullScreen(true)}
          >
            <Ionicons name="expand-outline" size={20} color={colors.text} />
          </TouchableOpacity>
          
          {activeImage > 0 && (
            <TouchableOpacity 
              style={[styles.navButton, styles.leftButton, { backgroundColor: colors.surface }]}
              onPress={() => changeImage('prev')}
            >
              <Ionicons name="chevron-back" size={20} color={colors.text} />
            </TouchableOpacity>
          )}
          
          {activeImage < product.images.length - 1 && (
            <TouchableOpacity 
              style={[styles.navButton, styles.rightButton, { backgroundColor: colors.surface }]}
              onPress={() => changeImage('next')}
            >
              <Ionicons name="chevron-forward" size={20} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.thumbnailScroll}
          contentContainerStyle={styles.thumbnailContainer}
        >
          {product.images.map((image, index) => (
            <TouchableOpacity 
              key={index} 
              onPress={() => setActiveImage(index)}
              style={[
                styles.thumbnailWrapper,
                { backgroundColor: colors.surface },
                activeImage === index && { borderColor: colors.primary }
              ]}
            >
              <Image 
                source={{ uri: image }} 
                style={styles.thumbnail} 
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.infoContainer}>
          <View style={styles.brandRow}>
            <Text style={[styles.brand, { color: colors.text }]}>{product.brand}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={colors.primary} />
              <Text style={[styles.rating, { color: colors.text }]}>{product.rating}</Text>
            </View>
          </View>

          <Text style={[styles.title, { color: colors.text }]}>{product.title}</Text>
          
          <Text style={[styles.price, { color: colors.text }]}>
            ${product.price}{' '}
            {product.discountPercentage > 0 && (
              <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
                ${Math.round(product.price / (1 - product.discountPercentage / 100))}
              </Text>
            )}
          </Text>

          <Text style={[styles.stockInfo, { color: colors.textSecondary }]}>
            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
          </Text>

          <Text style={[styles.descriptionTitle, { color: colors.text }]}>Description</Text>
          <Text style={[styles.description, { color: colors.textSecondary }]}>{product.description}</Text>
        </View>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity 
          style={[styles.arButton, { backgroundColor: colors.surface }]} 
          onPress={() => {}}
        >
          <Ionicons name="cube-outline" size={20} color={colors.text} />
          <Text style={[styles.arButtonText, { color: colors.text }]}>View in AR</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.addToCartButton, { backgroundColor: colors.primary }]} 
          onPress={() => {}}
        >
          <Ionicons name="cart-outline" size={20} color={colors.background} />
          <Text style={[styles.addToCartButtonText, { color: colors.background }]}>Add to Cart</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isFullScreen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsFullScreen(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={[styles.closeButton, { backgroundColor: colors.surface }]}
              onPress={() => setIsFullScreen(false)}
            >
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            
            <Animated.Image
              source={{ uri: product.images[activeImage] || product.thumbnail }}
              style={[styles.fullScreenImage, { opacity: fadeAnim }]}
              resizeMode="contain"
            />
            
            {activeImage > 0 && (
              <TouchableOpacity 
                style={[styles.modalNavButton, styles.modalLeftButton, { backgroundColor: colors.surface }]}
                onPress={() => changeImage('prev')}
              >
                <Ionicons name="chevron-back" size={24} color={colors.text} />
              </TouchableOpacity>
            )}
            
            {activeImage < product.images.length - 1 && (
              <TouchableOpacity 
                style={[styles.modalNavButton, styles.modalRightButton, { backgroundColor: colors.surface }]}
                onPress={() => changeImage('next')}
              >
                <Ionicons name="chevron-forward" size={24} color={colors.text} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80, // Fixed bottom padding for footer
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 14,
    marginTop: 12,
    fontWeight: '400',
  },
  errorText: {
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
    fontWeight: '400',
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 16,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  customHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 40, // Android status bar height
    elevation: 2,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 12,
  },
  imageGallery: {
    width: '100%',
    height: width * 0.8, // Slightly reduced height
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    elevation: 3,
  },
  discountText: {
    fontSize: 11,
    fontWeight: '600',
  },
  thumbnailScroll: {
    marginTop: 12,
  },
  thumbnailContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  thumbnailWrapper: {
    width: 60,
    height: 60,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 16,
  },
  brandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  brand: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    lineHeight: 26,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  originalPrice: {
    fontSize: 14,
    fontWeight: '400',
    textDecorationLine: 'line-through',
  },
  stockInfo: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
  },
  arButton: {
    flex: 1,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 6,
    elevation: 2,
  },
  arButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
  addToCartButton: {
    flex: 2,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 6,
    elevation: 4,
  },
  addToCartButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  leftButton: {
    left: 12,
  },
  rightButton: {
    right: 12,
  },
  fullScreenButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    elevation: 5,
  },
  fullScreenImage: {
    width: '100%',
    height: '80%',
  },
  modalNavButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  modalLeftButton: {
    left: 16,
  },
  modalRightButton: {
    right: 16,
  },
});