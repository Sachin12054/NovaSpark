import * as Linking from 'expo-linking';
import * as Clipboard from 'expo-clipboard';
import { Share } from 'react-native';

export function getReferralDeepLink(code: string): string {
  return `novaspark://register?ref=${code}`;
}

export function getReferralWebLink(code: string): string {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return `${window.location.origin}/register?ref=${code}`;
  }
  return `https://novaspark.vercel.app/register?ref=${code}`;
}

export function getShareableReferralLink(code: string): string {
  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return `${window.location.origin}/register?ref=${code}`;
  }
  return getReferralDeepLink(code);
}

export async function copyReferralLink(code: string): Promise<boolean> {
  const url = getShareableReferralLink(code);
  await Clipboard.setStringAsync(url);
  return true;
}

export async function shareOnWhatsApp(code: string): Promise<void> {
  const link = getShareableReferralLink(code);
  const message = `🚀 I'm building my first AI project with NovaSpark!\n\nJoin the free workshop:\nBuild Your First AI Project in 60 Minutes.\n\nRegister using my referral:\n${link}\n\nLet's build something with AI! 🤖`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  
  try {
    if (typeof window !== 'undefined' && window.open) {
      window.open(whatsappUrl, '_blank');
      return;
    }
    const canOpen = await Linking.canOpenURL(whatsappUrl);
    if (canOpen) {
      await Linking.openURL(whatsappUrl);
    } else {
      await Share.share({
        message: message,
        title: 'Join NovaSpark: Build Your First AI Project',
      });
    }
  } catch {
    await Share.share({
      message: message,
      title: 'Join NovaSpark: Build Your First AI Project',
    });
  }
}
