import { useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

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

export const sendTelegramLog = async (data: LogData) => {
  try {
    await supabase.functions.invoke('send-log', {
      body: {
        ...data,
        url: data.url || window.location.href,
        userAgent: data.userAgent || navigator.userAgent,
        timestamp: Date.now(),
      },
    });
  } catch (error) {
    // Silently fail - don't break the app for logging issues
    console.error('Failed to send log:', error);
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
