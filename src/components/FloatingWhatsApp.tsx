import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919999999999';

/**
 * Floating WhatsApp button. Sits above mobile safe area, smaller on mobile
 * so it doesn't block thumbs scrolling. Hidden when a sticky bottom buy bar
 * is rendered on the product page (CSS-driven via .with-bottom-bar on body).
 */
export default function FloatingWhatsApp() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      aria-label="Chat on WhatsApp"
      className="fixed bottom-4 right-4 z-30 inline-flex h-12 w-12 items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_10px_30px_rgba(37,211,102,0.45)] hover:bg-whatsapp-strong sm:h-14 sm:w-14 sm:bottom-6 sm:right-6"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0)' }}
    >
      <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
    </a>
  );
}
