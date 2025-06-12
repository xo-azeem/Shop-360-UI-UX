import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

// Define types for the product data
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

interface Category {
  name: string;
  image: string;
  productCount: number;
}

const ProductListScreen = () => {
  const { colors } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://dummyjson.com/products?limit=200');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Validate data structure
      if (!data || !data.products || !Array.isArray(data.products)) {
        throw new Error('Invalid data structure received');
      }
      
      console.log('Fetched Products:', data.products.length);
      setProducts(data.products);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err instanceof Error ? err.message : 'Failed to load products. Please try again.');
      setLoading(false);
    }
  };

  // Memoized filtered products for better performance
  const filteredProducts = useMemo(() => {
    let results = [...products];
    
    if (selectedCategory) {
      results = results.filter(product => product.category === selectedCategory);
      
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        results = results.filter(product => {
          const titleMatch = product.title?.toLowerCase().includes(query) || false;
          const brandMatch = product.brand?.toLowerCase().includes(query) || false;
          const descriptionMatch = product.description?.toLowerCase().includes(query) || false;
          return titleMatch || brandMatch || descriptionMatch;
        });
      }
    }
    
    return results;
  }, [products, searchQuery, selectedCategory]);

  // Memoized categories for better performance
  const categories = useMemo((): Category[] => {
    if (products.length === 0) return [];
    
    const categoryMap = new Map<string, { count: number, image: string }>();
    
    products.forEach(product => {
      if (product.category) {
        if (!categoryMap.has(product.category)) {
          categoryMap.set(product.category, {
            count: 1,
            image: product.thumbnail || ''
          });
        } else {
          const current = categoryMap.get(product.category)!;
          categoryMap.set(product.category, {
            count: current.count + 1,
            image: current.image || product.thumbnail || ''
          });
        }
      }
    });

    return Array.from(categoryMap.entries()).map(([name, { count, image }]) => ({
      name,
      image,
      productCount: count
    })).sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  const clearCategory = () => {
    setSelectedCategory(null);
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
  };

  const renderCategoryCard = ({ item }: { item: Category }) => (
    <TouchableOpacity 
      style={[styles.categoryCard, { backgroundColor: colors.surface }]}
      onPress={() => setSelectedCategory(item.name)}
      activeOpacity={0.8}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.categoryImage}
      />
      <View style={styles.categoryOverlay}>
        <Text style={styles.categoryName}>
          {item.name.charAt(0).toUpperCase() + item.name.slice(1).replace(/-/g, ' ')}
        </Text>
        <Text style={styles.categoryCount}>
          {item.productCount} items
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderProductItem = ({ item }: { item: Product }) => {
    const discountedPrice = item.discountPercentage > 0 
      ? (item.price * (1 - item.discountPercentage / 100))
      : item.price;

    return (
      <TouchableOpacity 
        style={[styles.productCard, { backgroundColor: colors.surface }]}
        onPress={() => router.push({
          pathname: "/product/[id]",
          params: { id: item.id.toString() }
        })}
        activeOpacity={0.9}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: item.thumbnail }} 
            style={styles.productImage}
          />
          {item.discountPercentage > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{Math.round(item.discountPercentage)}%</Text>
            </View>
          )}
        </View>
        
        <View style={styles.productInfo}>
          <Text style={[styles.brandText, { color: colors.textSecondary }]} numberOfLines={1}>
            {item.brand || 'No Brand'}
          </Text>
          <Text style={[styles.productTitle, { color: colors.text }]} numberOfLines={2}>
            {item.title}
          </Text>
          
          <View style={styles.priceContainer}>
            <Text style={[styles.productPrice, { color: colors.primary }]}>
              ${discountedPrice.toFixed(2)}
            </Text>
            {item.discountPercentage > 0 && (
              <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
                ${item.price.toFixed(2)}
              </Text>
            )}
          </View>
          
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={[styles.ratingText, { color: colors.textSecondary }]}>
              {item.rating?.toFixed(1) || '0.0'}
            </Text>
            <Text style={[styles.stockText, { color: colors.textSecondary }]}>
              • {item.stock || 0} left
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={[styles.addToCartButton, { 
            backgroundColor: colors.primary,
            borderColor: colors.border,
            borderWidth: 1,
          }]}
          onPress={(e) => {
            e.stopPropagation();
            console.log('Add to cart:', item.title);
            // Add to cart logic here
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={20} color={colors.surface} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centeredContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Loading products...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.centeredContainer}>
          <Ionicons name="alert-circle" size={48} color="#FF3B30" />
          <Text style={[styles.errorText, { color: colors.text }]}>{error}</Text>
          <TouchableOpacity 
            style={[styles.retryButton, { backgroundColor: colors.primary }]}
            onPress={fetchProducts}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.background === '#000000' ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      {selectedCategory && (
        <View style={[styles.header, { backgroundColor: colors.background }]}>
          <TouchableOpacity 
            style={[styles.headerButton, { backgroundColor: colors.surface }]}
            onPress={clearCategory}
          >
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace(/-/g, ' ')}
          </Text>
        </View>
      )}

      {selectedCategory && (
        <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search in category..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      )}

      {selectedCategory ? (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.productList}
          columnWrapperStyle={styles.productRow}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategoryCard}
          keyExtractor={item => item.name}
          numColumns={2}
          contentContainerStyle={styles.categoryList}
          columnWrapperStyle={styles.categoryRow}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 60,
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  clearButton: {
    padding: 8,
    marginRight: -4,
  },
  categoryList: {
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 30,
  },
  categoryRow: {
    justifyContent: 'space-between',
  },
  productList: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 30,
  },
  productRow: {
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: '48%',
    borderRadius: 20,
    overflow: 'hidden',
    aspectRatio: 1,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  categoryOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 13,
    fontWeight: '500',
    color: '#FFF',
    opacity: 0.9,
  },
  productCard: {
    width: '48%',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
    aspectRatio: 1,
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FF3B30',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  discountText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  productInfo: {
    padding: 16,
    paddingBottom: 20,
  },
  brandText: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  productTitle: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    fontWeight: '500',
    textDecorationLine: 'line-through',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 6,
  },
  stockText: {
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 6,
  },
  addToCartButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    marginTop: 24,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  retryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductListScreen;