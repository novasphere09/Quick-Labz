'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';

export const WhatsAppFloating: React.FC = () => {
  const whatsappNumber = '917018623940';
  const defaultMessage = encodeURIComponent(
    'Hi QuickLabz, I would like to enquire about booking a home blood test.'
  );

  return (
    <aside aria-label="Support & Help" className="fixed bottom-6 right-6 z-40 flex items-center group">
      {/* Tooltip on hover */}
      <span className="hidden sm:inline-block mr-3 px-3 py-1.5 bg-slate-900/90 backdrop-blur-md text-white text-xs font-medium rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-2 group-hover:translate-x-0 pointer-events-none">
        Chat with QuickLabz Support
      </span>

      <a
        href={`https://wa.me/${whatsappNumber}?text=${defaultMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-hover hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-emerald-200 active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        <MessageSquare className="w-7 h-7 fill-white" />
      </a>
    </aside>
  );
};
