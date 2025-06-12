import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';

type OrderItem = {
  id: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
};

type Order = {
  id: string;
  date: string;
  status: 'delivered' | 'processing' | 'shipped' | 'cancelled';
  items: OrderItem[];
  total: number;
  trackingNumber?: string;
};

const OrderHistoryScreen = () => {
  const { colors } = useTheme();
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '1',
      date: '2024-03-15',
      status: 'delivered',
      items: [
        {
          id: '1',
          name: 'Nike Air Max 270',
          brand: 'Nike',
          price: 150,
          quantity: 1,
          image: 'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/skwgyqrbfzhu6uyeh0gg/air-max-270-mens-shoes-KkLcGR.png',
        },
      ],
      total: 150,
      trackingNumber: '1Z999AA10123456789',
    },
    {
      id: '2',
      date: '2024-03-10',
      status: 'processing',
      items: [
        {
          id: '2',
          name: 'Adidas Ultraboost 22',
          brand: 'Adidas',
          price: 180,
          quantity: 1,
          image: 'https://assets.adidas.com/images/w_600,f_auto,q_auto/2c1a0a0a0a0a0a0a0a0a0a0a0a0a0a0a/ultraboost-22-shoes.jpg',
        },
      ],
      total: 180,
    },
  ]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'delivered':
        return '#4CD964';
      case 'processing':
        return '#FF9500';
      case 'shipped':
        return '#007AFF';
      case 'cancelled':
        return '#FF3B30';
      default:
        return colors.textSecondary;
    }
  };

  const handleViewOrder = (orderId: string) => {
    router.push(`/profile/order-details/${orderId}`);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.background === '#000000' ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {orders.map((order) => (
          <TouchableOpacity
            key={order.id}
            style={[styles.orderCard, { backgroundColor: colors.surface }]}
            onPress={() => handleViewOrder(order.id)}
          >
            <View style={styles.orderHeader}>
              <View>
                <Text style={[styles.orderId, { color: colors.text }]}>Order #{order.id}</Text>
                <Text style={[styles.orderDate, { color: colors.textSecondary }]}>
                  {new Date(order.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                <Text style={styles.statusText}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Text>
              </View>
            </View>

            <View style={styles.itemsContainer}>
              {order.items.map((item) => (
                <View key={item.id} style={styles.itemRow}>
                  <Image 
                    source={{ uri: item.image }}
                    style={styles.itemImage}
                    resizeMode="cover"
                  />
                  <View style={styles.itemInfo}>
                    <Text style={[styles.itemBrand, { color: colors.textSecondary }]}>{item.brand}</Text>
                    <Text style={[styles.itemName, { color: colors.text }]}>{item.name}</Text>
                    <Text style={[styles.itemQuantity, { color: colors.textSecondary }]}>
                      Qty: {item.quantity}
                    </Text>
                  </View>
                  <Text style={[styles.itemPrice, { color: colors.text }]}>${item.price}</Text>
                </View>
              ))}
            </View>

            <View style={[styles.orderFooter, { borderTopColor: colors.border }]}>
              <View>
                <Text style={[styles.totalLabel, { color: colors.textSecondary }]}>Total</Text>
                <Text style={[styles.totalAmount, { color: colors.text }]}>${order.total}</Text>
              </View>
              {order.trackingNumber && (
                <View style={styles.trackingContainer}>
                  <Ionicons name="car-outline" size={16} color={colors.textSecondary} />
                  <Text style={[styles.trackingText, { color: colors.textSecondary }]}>
                    {order.trackingNumber}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
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
  orderCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  itemsContainer: {
    paddingHorizontal: 16,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemBrand: {
    fontSize: 12,
    marginBottom: 2,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
  },
  itemQuantity: {
    fontSize: 12,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
  },
  totalLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  trackingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackingText: {
    fontSize: 12,
    marginLeft: 4,
  },
  header: undefined,
  backButton: undefined,
  headerTitle: undefined,
  placeholder: undefined,
});

export default OrderHistoryScreen; 