/**
 * Web Vitals Performance Monitoring
 * Measures LCP, FID, CLS, FCP, TTFB
 */

export interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

// Thresholds based on Web Vitals recommendations
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint
  FID: { good: 100, poor: 300 },   // First Input Delay
  CLS: { good: 0.1, poor: 0.25 },  // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte
};

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS];
  if (!threshold) return 'good';
  
  if (value <= threshold.good) return 'good';
  if (value <= threshold.poor) return 'needs-improvement';
  return 'poor';
}

// Log metrics to console in development
function logMetric(metric: WebVitalsMetric) {
  const emoji = metric.rating === 'good' ? '✅' : metric.rating === 'needs-improvement' ? '⚠️' : '❌';
  console.log(`${emoji} ${metric.name}: ${Math.round(metric.value)}ms (${metric.rating})`);
}

// Send metrics to analytics (can be customized)
function sendToAnalytics(metric: WebVitalsMetric) {
  // In production, send to your analytics service
  // e.g., Google Analytics, DataDog, New Relic, etc.
  logMetric(metric);
  
  // Example: Send to API endpoint
  // fetch('/api/analytics/web-vitals', {
  //   method: 'POST',
  //   body: JSON.stringify(metric),
  //   headers: { 'Content-Type': 'application/json' },
  // }).catch(console.error);
}

/**
 * Measure Largest Contentful Paint (LCP)
 */
export function measureLCP(onReport?: (metric: WebVitalsMetric) => void) {
  if (typeof window === 'undefined') return;
  
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
      
      const value = lastEntry.renderTime || lastEntry.loadTime || 0;
      const metric: WebVitalsMetric = {
        name: 'LCP',
        value,
        rating: getRating('LCP', value),
        delta: value,
        id: `lcp-${Date.now()}`,
      };
      
      sendToAnalytics(metric);
      onReport?.(metric);
    });
    
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (error) {
    console.error('Error measuring LCP:', error);
  }
}

/**
 * Measure First Input Delay (FID)
 */
export function measureFID(onReport?: (metric: WebVitalsMetric) => void) {
  if (typeof window === 'undefined') return;
  
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry: PerformanceEntry & { processingStart?: number }) => {
        const value = entry.processingStart ? entry.processingStart - entry.startTime : 0;
        const metric: WebVitalsMetric = {
          name: 'FID',
          value,
          rating: getRating('FID', value),
          delta: value,
          id: `fid-${Date.now()}`,
        };
        
        sendToAnalytics(metric);
        onReport?.(metric);
      });
    });
    
    observer.observe({ type: 'first-input', buffered: true });
  } catch (error) {
    console.error('Error measuring FID:', error);
  }
}

/**
 * Measure Cumulative Layout Shift (CLS)
 */
export function measureCLS(onReport?: (metric: WebVitalsMetric) => void) {
  if (typeof window === 'undefined') return;
  
  let clsValue = 0;
  
  try {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: PerformanceEntry & { value?: number; hadRecentInput?: boolean }) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value || 0;
          
          const metric: WebVitalsMetric = {
            name: 'CLS',
            value: clsValue,
            rating: getRating('CLS', clsValue),
            delta: entry.value || 0,
            id: `cls-${Date.now()}`,
          };
          
          sendToAnalytics(metric);
          onReport?.(metric);
        }
      });
    });
    
    observer.observe({ type: 'layout-shift', buffered: true });
  } catch (error) {
    console.error('Error measuring CLS:', error);
  }
}

/**
 * Measure First Contentful Paint (FCP)
 */
export function measureFCP(onReport?: (metric: WebVitalsMetric) => void) {
  if (typeof window === 'undefined') return;
  
  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          const metric: WebVitalsMetric = {
            name: 'FCP',
            value: entry.startTime,
            rating: getRating('FCP', entry.startTime),
            delta: entry.startTime,
            id: `fcp-${Date.now()}`,
          };
          
          sendToAnalytics(metric);
          onReport?.(metric);
        }
      });
    });
    
    observer.observe({ type: 'paint', buffered: true });
  } catch (error) {
    console.error('Error measuring FCP:', error);
  }
}

/**
 * Measure Time to First Byte (TTFB)
 */
export function measureTTFB(onReport?: (metric: WebVitalsMetric) => void) {
  if (typeof window === 'undefined') return;
  
  try {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry) {
      const value = navigationEntry.responseStart - navigationEntry.requestStart;
      const metric: WebVitalsMetric = {
        name: 'TTFB',
        value,
        rating: getRating('TTFB', value),
        delta: value,
        id: `ttfb-${Date.now()}`,
      };
      
      sendToAnalytics(metric);
      onReport?.(metric);
    }
  } catch (error) {
    console.error('Error measuring TTFB:', error);
  }
}

/**
 * Initialize all Web Vitals measurements
 */
export function initWebVitals(onReport?: (metric: WebVitalsMetric) => void) {
  if (typeof window === 'undefined') return;
  
  // Measure all core Web Vitals
  measureLCP(onReport);
  measureFID(onReport);
  measureCLS(onReport);
  measureFCP(onReport);
  measureTTFB(onReport);
  
  // Log that monitoring is active
  if (import.meta.env.DEV) {
    console.log('📊 Web Vitals monitoring initialized');
  }
}

/**
 * Get current performance metrics
 */
export function getPerformanceMetrics() {
  if (typeof window === 'undefined') return null;
  
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  const paint = performance.getEntriesByType('paint');
  
  return {
    // Navigation timing
    dns: navigation.domainLookupEnd - navigation.domainLookupStart,
    tcp: navigation.connectEnd - navigation.connectStart,
    ttfb: navigation.responseStart - navigation.requestStart,
    download: navigation.responseEnd - navigation.responseStart,
    domInteractive: navigation.domInteractive,
    domComplete: navigation.domComplete,
    loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
    
    // Paint timing
    fcp: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0,
    
    // Memory (if available)
    memory: (performance as any).memory ? {
      usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
      totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
      limit: (performance as any).memory.jsHeapSizeLimit,
    } : null,
  };
}

