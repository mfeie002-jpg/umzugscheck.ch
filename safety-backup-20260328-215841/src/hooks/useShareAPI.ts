import { useCallback } from 'react';
import { useHaptic } from './use-haptic';

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

export const useShareAPI = () => {
  const { trigger } = useHaptic();
  const isSupported = typeof navigator !== 'undefined' && !!navigator.share;
  const canShareFiles = typeof navigator !== 'undefined' && !!navigator.canShare;

  const share = useCallback(async (data: ShareData): Promise<boolean> => {
    if (!isSupported) {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(data.url || data.text || '');
        trigger('success');
        return true;
      } catch {
        return false;
      }
    }

    try {
      // Check if files can be shared
      if (data.files && canShareFiles) {
        const shareableData = { ...data };
        if (!navigator.canShare(shareableData)) {
          delete shareableData.files;
        }
        await navigator.share(shareableData);
      } else {
        const { files, ...shareData } = data;
        await navigator.share(shareData);
      }
      trigger('success');
      return true;
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Share failed:', error);
      }
      return false;
    }
  }, [isSupported, canShareFiles, trigger]);

  const shareCompany = useCallback((companyName: string, companySlug: string) => {
    return share({
      title: `${companyName} auf Umzugscheck.ch`,
      text: `Schau dir ${companyName} an - eine geprüfte Umzugsfirma in der Schweiz`,
      url: `${window.location.origin}/umzugsfirmen/${companySlug}`,
    });
  }, [share]);

  const shareQuote = useCallback((estimateId: string) => {
    return share({
      title: 'Mein Umzugsangebot',
      text: 'Ich habe ein Umzugsangebot auf Umzugscheck.ch erhalten',
      url: `${window.location.origin}/ergebnis/${estimateId}`,
    });
  }, [share]);

  return {
    isSupported,
    canShareFiles,
    share,
    shareCompany,
    shareQuote,
  };
};
