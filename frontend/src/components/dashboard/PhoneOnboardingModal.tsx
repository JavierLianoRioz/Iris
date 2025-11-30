import React, { useState } from 'react';
import { Modal } from '../ui/Modal';

interface PhoneOnboardingModalProps {
    isOpen: boolean;
    onSave: (phone: string) => void;
}

export default function PhoneOnboardingModal({ isOpen, onSave }: PhoneOnboardingModalProps) {
    const [phoneInput, setPhoneInput] = useState('');
    const [error, setError] = useState('');

    const handleSave = () => {
        const cleanPhone = phoneInput.replace(/\D/g, '');
        if (cleanPhone.length < 9) {
            setError('Por favor, introduce un número válido.');
            return;
        }
        onSave(phoneInput);
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
                <p className="text-slate-500 text-center text-sm mb-4">Para enviarte las notificaciones, necesitamos tu número de teléfono activo en WhatsApp.</p>
                <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Número de teléfono</label>
                    <input
                        type="tel"
                        id="phone"
                        placeholder="+34 600 000 000"
                        value={phoneInput}
                        onChange={(e) => { setPhoneInput(e.target.value); setError(''); }}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-900"
                    />
                    {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
                </div>
                <button onClick={handleSave} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all">Continuar</button>
            </div>
        </Modal>
    );
}
