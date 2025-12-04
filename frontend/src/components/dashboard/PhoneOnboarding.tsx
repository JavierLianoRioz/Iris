import React from 'react';
import PhoneOnboardingModal from './PhoneOnboardingModal';
import { useUser } from '../../hooks/useUser';

export default function PhoneOnboarding() {
        const { user, showPhoneModal, updateProfile, setShowPhoneModal } = useUser();

        const handleSave = async (phone: string) => {
                if (!user) return;
                const subjectCodes = user.subjects ? user.subjects.map(s => s.code) : [];
                try {
                        await updateProfile(user.name, phone, subjectCodes);
                        setShowPhoneModal(false);
                        window.location.reload();
                } catch (error) {
                        console.error("Failed to save phone", error);
                        alert("Error al guardar el teléfono. Revisa la consola para más detalles.");
                }
        };

        if (!user) return null;

        return (
                <PhoneOnboardingModal
                        isOpen={showPhoneModal}
                        onSave={handleSave}
                />
        );
}
