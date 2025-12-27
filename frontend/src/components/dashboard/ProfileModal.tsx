import React, { useState, useEffect } from 'react';
import EditProfileModal from './EditProfileModal';
import { useUser } from '../../hooks/useUser';
import { assert } from '../../utils/assert';

export default function ProfileModal() {
        const { user, updateProfile } = useUser();
        const [isOpen, setIsOpen] = useState(false);

        useEffect(() => {
                const handleOpen = () => setIsOpen(true);
                window.addEventListener('open-profile-modal', handleOpen);
                return () => window.removeEventListener('open-profile-modal', handleOpen);
        }, []);

        const handleSave = async (name: string, phone: string) => {
                assert(user, "User missing during save");
                
                const subjectCodes = user.subjects.map(s => s.code);

                try {
                        await updateProfile(name, phone, subjectCodes);
                        setIsOpen(false);
                        window.location.reload();
                } catch (error) {
                        console.error(error);
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
