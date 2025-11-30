import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';

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
            setPhone(initialPhone);
            setError('');
        }
    }, [isOpen, initialName, initialPhone]);

    const handleSave = () => {
        const cleanPhone = phone.replace(/\D/g, '');
        if (cleanPhone.length < 9) {
            setError('Por favor, introduce un número válido.');
            return;
        }
        if (!name.trim()) {
            setError('El nombre no puede estar vacío.');
            return;
        }
        onSave(name, phone);
    };

    return (
        <Modal isOpen={isOpen} title="Editar Perfil" onClose={onClose}>
            <div className="space-y-4">
                <div>
                    <label htmlFor="edit-name" className="block text-sm font-medium text-slate-700 mb-1">Nombre completo</label>
                    <input
                        type="text"
                        id="edit-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-slate-900"
                    />
                </div>
                <div>
                    <label htmlFor="edit-phone" className="block text-sm font-medium text-slate-700 mb-1">Número de teléfono</label>
                    <input
                        type="tel"
                        id="edit-phone"
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value); setError(''); }}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-slate-900"
                    />
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
