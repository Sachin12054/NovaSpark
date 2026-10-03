import { firestore } from './firebase';
import { collection, addDoc } from 'firebase/firestore';
import Constants from 'expo-constants';

const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL && !process.env.EXPO_PUBLIC_API_URL.includes('localhost')) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  const debuggerHost = Constants.expoConfig?.hostUri;
  if (debuggerHost) {
    const ip = debuggerHost.split(':')[0];
    return `http://${ip}:8000`;
  }
  return process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';
};

const BASE_URL = getBaseUrl();

export async function logCampaignEvent(
  eventType: string,
  studentId?: string,
  source: string = 'Mobile App',
  metadata: Record<string, any> = {}
) {
  const eventPayload = {
    eventType,
    studentId,
    source,
    metadata,
    createdAt: new Date().toISOString(),
  };

  // 1. Backend REST telemetry
  try {
    fetch(`${BASE_URL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventPayload),
    }).catch(() => {});
  } catch (e) {}

  // 2. Direct Firestore logging via canonical firestore instance
  try {
    if (firestore) {
      const eventsRef = collection(firestore, 'campaign_events');
      addDoc(eventsRef, eventPayload).catch(() => {});
    }
  } catch (e) {}
}
