import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface LogData {
  type: 'error' | 'pageview' | 'startup' | 'info';
  message: string;
  details?: string;
  url?: string;
  userAgent?: string;
}

// Debounce to prevent spam
const loggedPages = new Set<string>();
let startupLogged = false;

// Lazy load supabase to avoid initialization errors
let supabaseInstance: any = null;

const getSupabase = async () => {
  if (supabaseInstance) return supabaseInstance;
  
  try {
    const { supabase } = await import('@/integrations/supabase/client');
    supabaseInstance = supabase;
    return supabase;
  } catch (error) {
    console.warn('Supabase client not ready, will retry...');
    return null;
  }
};

export const sendTelegramLog = async (data: LogData, retries = 3) => {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const supabase = await getSupabase();
      if (!supabase) {
        // Wait a bit and retry
        await new Promise(resolve => setTimeout(resolve, 500 * (attempt + 1)));
        continue;
      }
      
      await supabase.functions.invoke('send-log', {
        body: {
          ...data,
          url: data.url || window.location.href,
          userAgent: data.userAgent || navigator.userAgent,
          timestamp: Date.now(),
        },
      });
      return; // Success
    } catch (error) {
      if (attempt === retries - 1) {
        // Final attempt failed - silently fail
        console.error('Failed to send log after retries:', error);
      }
    }
  }
};

export const useTelegramLogger = () => {
  const location = useLocation();
  const hasLoggedStartup = useRef(false);

  // Log startup once when the app loads
  useEffect(() => {
    if (!startupLogged && !hasLoggedStartup.current) {
      hasLoggedStartup.current = true;
      startupLogged = true;
      
      sendTelegramLog({
        type: 'startup',
        message: 'Website is now online',
        url: window.location.origin,
      });
    }
  }, []);

  // Log page views (debounced per session)
  useEffect(() => {
    const pageKey = location.pathname + location.search;
    
    if (!loggedPages.has(pageKey)) {
      loggedPages.add(pageKey);
      
      const pageName = getPageName(location.pathname);
      sendTelegramLog({
        type: 'pageview',
        message: `User visited: ${pageName}`,
        url: window.location.href,
      });
    }
  }, [location.pathname, location.search]);

  // Error logging function
  const logError = useCallback((error: Error | string, context?: string) => {
    const errorMessage = error instanceof Error ? error.message : error;
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    sendTelegramLog({
      type: 'error',
      message: context ? `${context}: ${errorMessage}` : errorMessage,
      details: errorStack,
    });
  }, []);

  return { logError, sendTelegramLog };
};

function getPageName(pathname: string): string {
  const routes: Record<string, string> = {
    '/': 'Home Page',
    '/success': 'Success Page',
  };
  
  return routes[pathname] || pathname;
}

// Global error handler setup
export const setupGlobalErrorHandler = () => {
  // Handle uncaught errors
  window.onerror = (message, source, lineno, colno, error) => {
    sendTelegramLog({
      type: 'error',
      message: `Uncaught Error: ${message}`,
      details: `Source: ${source}\nLine: ${lineno}, Column: ${colno}\n${error?.stack || ''}`,
    });
    return false; // Let the error propagate
  };

  // Handle unhandled promise rejections
  window.onunhandledrejection = (event) => {
    sendTelegramLog({
      type: 'error',
      message: `Unhandled Promise Rejection: ${event.reason?.message || event.reason}`,
      details: event.reason?.stack || String(event.reason),
    });
  };
};
