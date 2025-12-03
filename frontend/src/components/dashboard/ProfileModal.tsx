import React, { useState, useEffect } from 'react';
import EditProfileModal from './EditProfileModal';
import { useUser } from '../../hooks/useUser';

export default function ProfileModal() {
        const { user, updateProfile } = useUser();
        const [isOpen, setIsOpen] = useState(false);

        useEffect(() => {
                const handleOpen = () => setIsOpen(true);
                window.addEventListener('open-profile-modal', handleOpen);
                return () => window.removeEventListener('open-profile-modal', handleOpen);
        }, []);

        const handleSave = async (name: string, phone: string) => {
                if (!user) return;
                // We need to pass the current subjects to updateProfile because the API expects it
                // But wait, useUser.updateProfile takes (name, phone, subjects)
                // We can get subjects from user.subjects (BackendSubject[]) -> map to codes
                const subjectCodes = user.subjects ? user.subjects.map(s => s.code) : [];

                try {
                        await updateProfile(name, phone, subjectCodes);
                        setIsOpen(false);
                        // Force reload to update the header (since it reads from localStorage on load)
                        // Or dispatch an event to update the header without reload
                        window.location.reload();
                } catch (error) {
                        console.error("Failed to update profile", error);
                        alert("Error al actualizar el perfil");
                }
        };

        if (!user) return null;

        return (
                <EditProfileModal
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        onSave={handleSave}
                        initialName={user.name}
                        initialPhone={user.phone || ''}
                />
        );
}
