import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { validateSpanishPhone, formatForApi, PHONE_PREFIX_DISPLAY } from '../../utils/phone';

interface PhoneOnboardingModalProps {
    isOpen: boolean;
    onSave: (phone: string) => void;
}

export default function PhoneOnboardingModal({ isOpen, onSave }: PhoneOnboardingModalProps) {
    const [phoneInput, setPhoneInput] = useState('');
    const [error, setError] = useState('');

    const handleSave = () => {
        if (phoneInput.includes('+')) {
            setError(`No escribas el prefijo (${PHONE_PREFIX_DISPLAY}), solo tu número.`);
            return;
        }

        if (!validateSpanishPhone(phoneInput)) {
            setError('Por favor, introduce un número válido.');
            return;
        }

        onSave(formatForApi(phoneInput));
    };

    return (
        <Modal
            isOpen={isOpen}
            title="Vincula tu WhatsApp"
            icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
            }
        >
            <div className="space-y-4">
                <p className="text-slate-500 dark:text-slate-400 text-center text-sm mb-4">Para enviarte las notificaciones, necesitamos tu número de teléfono activo en WhatsApp.</p>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Número de teléfono</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">{PHONE_PREFIX_DISPLAY}</span>
                        </div>
                        <input
                            type="tel"
                            id="phone"
                            placeholder="600 000 000"
                            value={phoneInput}
                            onChange={(e) => { setPhoneInput(e.target.value); setError(''); }}
                            className="w-full pl-14 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900 outline-none transition-all text-slate-900 dark:text-white"
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
                </div>
                <button onClick={handleSave} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all">Continuar</button>
            </div>
        </Modal>
    );
}
