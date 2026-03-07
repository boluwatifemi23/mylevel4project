'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        
        duration: 4000,
        style: {
          background: '#fff',
          color: '#1f2937',
          borderRadius: '12px',
          padding: '16px',
          fontSize: '14px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        },
        
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
          style: {
            border: '1px solid #d1fae5',
            background: '#f0fdf4',
          },
        },
       
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
          style: {
            border: '1px solid #fecaca',
            background: '#fef2f2',
          },
        },
        
        loading: {
          iconTheme: {
            primary: '#ec4899',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}