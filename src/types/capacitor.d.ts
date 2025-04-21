
// Type definitions for Capacitor and custom window events
import { Capacitor } from '@capacitor/core';

declare global {
  interface WindowEventMap {
    'statusTap': Event;
    'ionBackButton': CustomEvent;
    'sidebar-toggle': CustomEvent;
    'exitApp': CustomEvent;
  }

  interface Window {
    Capacitor?: typeof Capacitor;
  }
}

export {};
