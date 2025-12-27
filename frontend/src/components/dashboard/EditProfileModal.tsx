import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { stripCountryCode, validateSpanishPhone, formatForApi, PHONE_PREFIX_DISPLAY } from '../../utils/phone';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string, phone: string) => void;
    initialName: string;
    initialPhone: string;
}

export default function EditProfileModal({ isOpen, onClose, onSave, initialName, initialPhone }: EditProfileModalProps) {
    const [name, setName] = useState(initialName);
    const [phone, setPhone] = useState(initialPhone);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName(initialName);
            setPhone(stripCountryCode(initialPhone));
            setError('');
        }
    }, [isOpen, initialName, initialPhone]);

    const handleSave = () => {
        if (phone.includes('+')) {
            setError(`No escribas el prefijo (${PHONE_PREFIX_DISPLAY}), solo tu número.`);
            return;
        }

        if (!validateSpanishPhone(phone)) {
            setError('Por favor, introduce un número válido.');
            return;
        }

        if (!name.trim()) {
            setError('El nombre no puede estar vacío.');
            return;
        }

        onSave(name, formatForApi(phone));
    };

    return (
        <Modal isOpen={isOpen} title="Editar Perfil" onClose={onClose}>
            <div className="space-y-4">
                <div>
                    <label htmlFor="edit-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre completo</label>
                    <input
                        type="text"
                        id="edit-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
                    />
                </div>
                <div>
                    <label htmlFor="edit-phone" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Número de teléfono</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">{PHONE_PREFIX_DISPLAY}</span>
                        </div>
                        <input
                            type="tel"
                            id="edit-phone"
                            value={phone}
                            onChange={(e) => { setPhone(e.target.value); setError(''); }}
                            className="w-full pl-14 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white"
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
                </div>
                <div className="pt-2 flex gap-3">
                    <button onClick={onClose} className="flex-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold py-3 rounded-xl transition-all">Cancelar</button>
                    <button onClick={handleSave} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all">Guardar</button>
                </div>
            </div>
        </Modal>
    );
}
