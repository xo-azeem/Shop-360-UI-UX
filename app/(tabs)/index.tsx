import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View, StatusBar, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useTheme } from '@/context/ThemeContext';

// Define types for props
interface FeatureSectionProps {
  title: string;
  description: string;
  iconType: 'sf' | 'ionicon';
  sfIconName?: 'house.fill' | 'paperplane.fill' | 'chevron.left.forwardslash.chevron.right' | 'chevron.right';
  ionIconName?: string;
}

interface FeaturedProductProps {
  title: string;
  image: string;
  price: string;
}

// Minimal feature section component
const FeatureSection = ({ title, description, iconType, sfIconName, ionIconName }: FeatureSectionProps) => {
  const { colors, isDark } = useTheme();
  return (
    <View style={[styles.featureCard, { 
      backgroundColor: colors.surface,
      borderColor: colors.border 
    }]}>
      <View style={[styles.featureIconContainer, { 
        backgroundColor: isDark ? colors.primary : '#FFFFFF',
        borderColor: colors.border
      }]}>
        {iconType === 'ionicon' ? (
          <Ionicons 
            name={ionIconName as any} 
            size={22} 
            color={isDark ? colors.background : colors.primary} 
          />
        ) : (
          <IconSymbol 
            size={22} 
            name={sfIconName!} 
            color={isDark ? colors.background : colors.primary} 
          />
        )}
      </View>
      <ThemedText type="defaultSemiBold" style={[styles.featureTitle, { color: colors.text }]}>{title}</ThemedText>
      <ThemedText style={[styles.featureDescription, { color: colors.textSecondary }]}>{description}</ThemedText>
    </View>
  );
};

// Featured product component
const FeaturedProduct = ({ title, image, price }: FeaturedProductProps) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity 
      style={[styles.featuredProductCard, { backgroundColor: colors.surface }]} 
      onPress={() => router.push('/(tabs)/products')}
    >
      <Image source={{ uri: image }} style={styles.featuredProductImage} />
      <View style={styles.featuredProductInfo}>
        <ThemedText type="defaultSemiBold" style={[styles.featuredProductTitle, { color: colors.text }]}>{title}</ThemedText>
        <ThemedText style={[styles.featuredProductPrice, { color: colors.primary }]}>{price}</ThemedText>
      </View>
    </TouchableOpacity>
  );
};

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar 
        barStyle={isDark ? "light-content" : "dark-content"} 
        backgroundColor={colors.background} 
        translucent={false}
      />
      <ScrollView 
        style={[styles.scrollView, { backgroundColor: colors.background }]} 
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <ThemedText type="title" style={[styles.welcomeText, { color: colors.textSecondary }]}>Welcome to</ThemedText>
            <ThemedText type="title" style={[styles.appName, { color: colors.text }]}>Shop360°</ThemedText>
          </View>
          <TouchableOpacity 
            style={[styles.profileButton, { 
              backgroundColor: colors.surface,
              borderColor: colors.border 
            }]}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <MaterialIcons name="person" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Banner */}
        <View style={[styles.bannerContainer, { borderColor: colors.border }]}>
          <Image 
            source={{ uri: 'https://images.ctfassets.net/wp1lcwdav1p1/2bzxvC8K1Cv0OMSQEA7p9l/eaa3de48c71d61a4a7d9c064d7235db6/GettyImages-1351925376.jpg?w=1500&h=680&q=60&fit=fill&f=faces&fm=jpg&fl=progressive' }} 
            style={styles.bannerImage}
          />
          <View style={[styles.bannerOverlay, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
            <ThemedText type="title" style={styles.bannerTitle}>View in AR</ThemedText>
            <ThemedText style={styles.bannerSubtitle}>Experience products in your space</ThemedText>
            <TouchableOpacity 
              style={[styles.bannerButton, { 
                backgroundColor: isDark ? colors.primary : '#FFFFFF',
                borderColor: colors.border
              }]} 
              onPress={() => router.push('/(tabs)/products')}
            >
              <ThemedText style={[styles.bannerButtonText, { 
                color: isDark ? colors.background : colors.primary 
              }]}>Explore Now</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Features section */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.text }]}>Why Shop With Us</ThemedText>
        </View>
        
        <View style={styles.featuresContainer}>
          <FeatureSection 
            title="AR Experience" 
            description="Try products in your space" 
            iconType="ionicon"
            ionIconName="cube-outline"
          />
          <FeatureSection 
            title="Precise Details" 
            description="Exact dimensions and specs" 
            iconType="ionicon"
            ionIconName="scan-outline"
          />
          <FeatureSection 
            title="Smart Shopping" 
            description="Intelligent recommendations" 
            iconType="ionicon"
            ionIconName="sparkles-outline"
          />
        </View>

        {/* Featured products */}
        <View style={styles.sectionHeader}>
          <ThemedText type="subtitle" style={[styles.sectionTitle, { color: colors.text }]}>Featured Products</ThemedText>
          <TouchableOpacity onPress={() => router.push('/(tabs)/products')}>
            <ThemedText style={[styles.viewAllText, { color: colors.textSecondary }]}>View All</ThemedText>
          </TouchableOpacity>
        </View>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.featuredProductsContainer}
          contentContainerStyle={styles.featuredProductsContent}
        >
          <FeaturedProduct 
            title="Wireless Headphones" 
            image="https://pcstore.pk/wp-content/uploads/2024/01/Sony-WH-CH520-Wireless-Headphones-with-Microphone-_price-in-pakistan-Black-img1-min.png" 
            price="$129.99" 
          />
          <FeaturedProduct 
            title="Smart Watch" 
            image="https://images.samsung.com/is/image/samsung/p6pim/pk/sm-l310nzg8eua/gallery/pk-galaxy-watch7-l310-sm-l310nzg8eua-thumb-544769007?$UX_EXT2_PNG$" 
            price="$249.99" 
          />
          <FeaturedProduct 
            title="Bluetooth Speaker" 
            image="https://cdn.thewirecutter.com/wp-content/media/2024/11/portablebluetoothspeakers-2048px-9481.jpg?auto=webp&quality=75&width=1024" 
            price="$79.99" 
          />
        </ScrollView>
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Account for tab bar
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    marginBottom: 4,
  },
  appName: {
    fontSize: 28,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  bannerContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    height: 200,
    marginBottom: 32,
    position: 'relative',
    borderWidth: 1,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  bannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 24,
    justifyContent: 'center',
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    marginBottom: 8,
  },
  bannerSubtitle: {
    color: '#FFFFFF',
    fontSize: 16,
    marginBottom: 20,
    opacity: 0.8,
  },
  bannerButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    fontWeight: '600',
    fontSize: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
  },
  viewAllText: {
    fontSize: 14,
  },
  featuresContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 32,
    justifyContent: 'space-between',
  },
  featureCard: {
    flex: 1,
    padding: 18,
    marginHorizontal: 6,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    textAlign: 'center',
  },
  featuredProductsContainer: {
    marginBottom: 32,
  },
  featuredProductsContent: {
    paddingHorizontal: 20,
  },
  featuredProductCard: {
    width: width * 0.6,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  featuredProductImage: {
    width: '100%',
    height: 200,
  },
  featuredProductInfo: {
    padding: 16,
  },
  featuredProductTitle: {
    fontSize: 16,
    marginBottom: 8,
  },
  featuredProductPrice: {
    fontSize: 18,
    fontWeight: '600',
  },
});