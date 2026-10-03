import React, { useEffect } from 'react';
import { Tabs } from 'expo-router';
import { Colors } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { signInAnonymousStudent } from '../services/auth';

export default function RootLayout() {
  useEffect(() => {
    // Lightweight anonymous student session on startup
    signInAnonymousStudent().catch(() => {});
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#0a0e17',
            borderTopColor: 'rgba(255, 255, 255, 0.08)',
            height: 62,
            paddingBottom: 8,
            paddingTop: 6,
          },
          tabBarActiveTintColor: Colors.primaryLight,
          tabBarInactiveTintColor: Colors.textDim,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="sparkles" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            title: 'Nova AI',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="chatbubble-ellipses" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="project"
          options={{
            title: 'Projects',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="compass" size={20} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="growth"
          options={{
            title: 'Growth',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="analytics" size={20} color={color} />
            ),
          }}
        />
        {/* Hidden sub-screens routed via CTAs */}
        <Tabs.Screen
          name="dashboard"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="register"
          options={{
            href: null,
          }}
        />
        <Tabs.Screen
          name="leaderboard"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
