import { Buffer } from 'buffer';

declare global {
  interface Window {
    Buffer: typeof Buffer;
    umami: {
      track: (event: string, properties?: Record<string, unknown>) => void;
    };
  }
}