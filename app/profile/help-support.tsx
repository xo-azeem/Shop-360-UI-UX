import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';

type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

type SupportOption = {
  id: string;
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  action: () => void;
};

const HelpSupportScreen = () => {
  const { colors } = useTheme();
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const faqs: FAQItem[] = [
    {
      id: '1',
      question: 'How do I track my order?',
      answer: 'You can track your order by going to the Orders section in your profile. Click on the specific order to view its current status and tracking information.',
    },
    {
      id: '2',
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. You can manage your payment methods in the Payment Methods section.',
    },
    {
      id: '3',
      question: 'How can I return an item?',
      answer: 'To return an item, go to the Orders section, select the order containing the item you want to return, and click on "Return Item". Follow the instructions to complete the return process.',
    },
    {
      id: '4',
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. You can check shipping rates during checkout.',
    },
  ];

  const supportOptions: SupportOption[] = [
    {
      id: '1',
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: 'chatbubble-ellipses-outline',
      action: () => {
        // Implement live chat functionality
      },
    },
    {
      id: '2',
      title: 'Email Support',
      description: 'support@shop360.com',
      icon: 'mail-outline',
      action: () => {
        // Implement email support
      },
    },
    {
      id: '3',
      title: 'Phone Support',
      description: '+1 (800) 123-4567',
      icon: 'call-outline',
      action: () => {
        // Implement phone support
      },
    },
    {
      id: '4',
      title: 'Social Media',
      description: 'Follow us for updates',
      icon: 'share-social-outline',
      action: () => {
        // Implement social media links
      },
    },
  ];

  const handleSendMessage = () => {
    if (message.trim()) {
      // Implement message sending functionality
      setMessage('');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.background === '#000000' ? "light-content" : "dark-content"} backgroundColor={colors.background} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Frequently Asked Questions</Text>
        {faqs.map((faq) => (
          <TouchableOpacity
            key={faq.id}
            style={[styles.faqItem, { backgroundColor: colors.surface }]}
            onPress={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
          >
            <View style={styles.faqHeader}>
              <Text style={[styles.faqQuestion, { color: colors.text }]}>
                {faq.question}
              </Text>
              <Ionicons 
                name={expandedFAQ === faq.id ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color={colors.textSecondary} 
              />
            </View>
            {expandedFAQ === faq.id && (
              <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                {faq.answer}
              </Text>
            )}
          </TouchableOpacity>
        ))}

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>
          Contact Support
        </Text>
        <View style={styles.supportOptions}>
          {supportOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.supportOption, { backgroundColor: colors.surface }]}
              onPress={option.action}
            >
              <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                <Ionicons name={option.icon} size={24} color={colors.primary} />
              </View>
              <View style={styles.optionInfo}>
                <Text style={[styles.optionTitle, { color: colors.text }]}>
                  {option.title}
                </Text>
                <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                  {option.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: 24 }]}>
          Send us a Message
        </Text>
        <View style={[styles.messageContainer, { backgroundColor: colors.surface }]}>
          <TextInput
            style={[styles.messageInput, { 
              color: colors.text,
              backgroundColor: colors.background,
            }]}
            placeholder="Type your message here..."
            placeholderTextColor={colors.textSecondary}
            multiline
            value={message}
            onChangeText={setMessage}
          />
          <TouchableOpacity
            style={[styles.sendButton, { backgroundColor: colors.primary }]}
            onPress={handleSendMessage}
          >
            <Ionicons name="send" size={20} color={colors.surface} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  faqItem: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
    padding: 16,
    paddingTop: 0,
  },
  supportOptions: {
    gap: 12,
  },
  supportOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  messageInput: {
    flex: 1,
    minHeight: 80,
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    textAlignVertical: 'top',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HelpSupportScreen; 