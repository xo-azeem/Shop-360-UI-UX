import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = {
  THEME: '@theme',
  USER: '@user',
  AUTH_TOKEN: '@auth_token',
  CART: '@cart',
  WISHLIST: '@wishlist',
  ADDRESSES: '@addresses',
  PAYMENT_METHODS: '@payment_methods',
  NOTIFICATION_PREFERENCES: '@notification_preferences',
} as const;

// Theme storage
export const storeTheme = async (isDark: boolean) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(isDark));
  } catch (error) {
    console.error('Error storing theme:', error);
  }
};

export const getTheme = async (): Promise<boolean | null> => {
  try {
    const theme = await AsyncStorage.getItem(STORAGE_KEYS.THEME);
    return theme ? JSON.parse(theme) : null;
  } catch (error) {
    console.error('Error getting theme:', error);
    return null;
  }
};

// User storage
export const storeUser = async (user: any) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (error) {
    console.error('Error storing user:', error);
  }
};

export const getUser = async () => {
  try {
    const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

// Auth token storage
export const storeAuthToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error('Error storing auth token:', error);
  }
};

export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Cart storage
export const storeCart = async (cart: any[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  } catch (error) {
    console.error('Error storing cart:', error);
  }
};

export const getCart = async () => {
  try {
    const cart = await AsyncStorage.getItem(STORAGE_KEYS.CART);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error getting cart:', error);
    return [];
  }
};

// Wishlist storage
export const storeWishlist = async (wishlist: any[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  } catch (error) {
    console.error('Error storing wishlist:', error);
  }
};

export const getWishlist = async () => {
  try {
    const wishlist = await AsyncStorage.getItem(STORAGE_KEYS.WISHLIST);
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    console.error('Error getting wishlist:', error);
    return [];
  }
};

// Addresses storage
export const storeAddresses = async (addresses: any[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(addresses));
  } catch (error) {
    console.error('Error storing addresses:', error);
  }
};

export const getAddresses = async () => {
  try {
    const addresses = await AsyncStorage.getItem(STORAGE_KEYS.ADDRESSES);
    return addresses ? JSON.parse(addresses) : [];
  } catch (error) {
    console.error('Error getting addresses:', error);
    return [];
  }
};

// Payment methods storage
export const storePaymentMethods = async (paymentMethods: any[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.PAYMENT_METHODS, JSON.stringify(paymentMethods));
  } catch (error) {
    console.error('Error storing payment methods:', error);
  }
};

export const getPaymentMethods = async () => {
  try {
    const paymentMethods = await AsyncStorage.getItem(STORAGE_KEYS.PAYMENT_METHODS);
    return paymentMethods ? JSON.parse(paymentMethods) : [];
  } catch (error) {
    console.error('Error getting payment methods:', error);
    return [];
  }
};

// Notification preferences storage
export const storeNotificationPreferences = async (preferences: any) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_PREFERENCES, JSON.stringify(preferences));
  } catch (error) {
    console.error('Error storing notification preferences:', error);
  }
};

export const getNotificationPreferences = async () => {
  try {
    const preferences = await AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_PREFERENCES);
    return preferences ? JSON.parse(preferences) : null;
  } catch (error) {
    console.error('Error getting notification preferences:', error);
    return null;
  }
};

// Clear all storage
export const clearAllStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
}; 