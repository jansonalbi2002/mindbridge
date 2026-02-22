import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactFab() {
    const [isOpen, setIsOpen] = useState(false);

    const phoneNumber = '+15196173550';
    const displayPhone = '+1 (519) 617-3550';
    const whatsappUrl = `https://wa.me/${phoneNumber.replace('+', '')}`;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="flex flex-col gap-2"
                    >
                        {/* WhatsApp Button */}
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-end gap-3"
                        >
                            <span className="rounded bg-slate-800 px-3 py-1 text-sm font-medium text-white shadow-lg opacity-0 transition-opacity group-hover:opacity-100 dark:bg-slate-200 dark:text-slate-900">
                                WhatsApp
                            </span>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </div>
                        </a>

                        {/* Call Button */}
                        <a
                            href={`tel:${phoneNumber}`}
                            className="group flex items-center justify-end gap-3"
                        >
                            <span className="rounded bg-slate-800 px-3 py-1 text-sm font-medium text-white shadow-lg opacity-0 transition-opacity group-hover:opacity-100 dark:bg-slate-200 dark:text-slate-900 whitespace-nowrap">
                                {displayPhone}
                            </span>
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-lg hover:scale-110 transition-transform">
                                <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.896-1.596-5.48-4.18-7.076-7.076l1.293-.97c.362-.271.527-.733.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                                </svg>
                            </div>
                        </a>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Toggle Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-xl hover:bg-primary/90 hover:scale-105 transition-all focus:outline-none focus:ring-4 focus:ring-primary/30"
                aria-label="Contact us"
            >
                <motion.div
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-7 w-7">
                        {isOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.84 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.221-1.15-2.136-2.389-2.305a48.67 48.67 0 00-7.382 0c-1.239.169-2.39 1.084-2.39 2.305v2.66m7.214 16.208c-.164.06-.33.11-.496.15m0 0a48.653 48.653 0 01-3.264.673l-1.982 1.982v-2.18m8.74-1.85a48.665 48.665 0 00-3.32-.6m0 0c.164-.06.33-.11.496-.15m0 0L15.345 22.5" />
                        )}
                    </svg>
                </motion.div>
            </button>
        </div>
    );
}
