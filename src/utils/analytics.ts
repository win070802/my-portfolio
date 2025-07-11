// Google Analytics tracking utilities

declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js' | 'set',
      targetId?: string | Date,
      config?: Record<string, any>
    ) => void;
  }
}

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track page views (for custom routing)
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID!, {
      page_path: url,
      page_title: title || document.title,
    });
  }
};

// Track contact form submissions
export const trackContactForm = (method: 'email' | 'phone' | 'linkedin') => {
  trackEvent('contact', 'engagement', method);
};

// Track project views
export const trackProjectView = (projectName: string) => {
  trackEvent('view_project', 'projects', projectName);
};

// Track downloads (CV, etc.)
export const trackDownload = (fileName: string) => {
  trackEvent('download', 'files', fileName);
};

// Track external link clicks
export const trackExternalLink = (url: string, linkText?: string) => {
  trackEvent('click', 'external_link', linkText || url);
}; 