import { useState, useEffect, useCallback } from 'react';
import { googleLogout } from '@react-oauth/google';
import { api } from '../services/api';
import type { User, BackendSubject } from '../types';

export const useUser = () => {
        const [user, setUser] = useState<User | null>(null);
        const [isLoading, setIsLoading] = useState(true);
        const [isSaving, setIsSaving] = useState(false);
        const [error, setError] = useState<string | null>(null);
        const [showPhoneModal, setShowPhoneModal] = useState(false);

        const loadUser = useCallback(async () => {
                setIsLoading(true);
                const storedUserStr = localStorage.getItem('irisUser');
                if (!storedUserStr) {
                        setIsLoading(false);
                        return;
                }

                const parsedUser = JSON.parse(storedUserStr);
                setUser(parsedUser);

                try {
                        const backendUser = await api.getUser(parsedUser.email);
                        if (backendUser) {
                                const updatedUser = {
                                        ...parsedUser,
                                        name: backendUser.name,
                                        phone: backendUser.phone,
                                        subjects: backendUser.subjects,
                                };
                                setUser(updatedUser);
                                localStorage.setItem('irisUser', JSON.stringify(updatedUser));

                                if (!backendUser.phone) {
                                        setShowPhoneModal(true);
                                }
                        } else {
                                if (!parsedUser.phone) setShowPhoneModal(true);
                        }
                } catch (err) {
                        console.error("Error syncing user with backend:", err);
                        if (!parsedUser.phone) setShowPhoneModal(true);
                } finally {
                        setIsLoading(false);
                }
        }, []);

        useEffect(() => {
                loadUser();
        }, [loadUser]);

        const logout = () => {
                googleLogout();
                localStorage.removeItem('irisUser');
                window.location.href = '/';
        };

        const updateProfile = async (name: string, phone: string, subjects: string[]) => {
                if (!user) return;
                setIsSaving(true);
                setError(null);
                try {
                        const updatedBackendUser = await api.updateSubscription({
                                email: user.email,
                                name,
                                phone,
                                subjects,
                        });

                        const updatedUser = {
                                ...user,
                                name: updatedBackendUser.name,
                                phone: updatedBackendUser.phone,
                                subjects: updatedBackendUser.subjects,
                        };
                        setUser(updatedUser);
                        localStorage.setItem('irisUser', JSON.stringify(updatedUser));
                        setShowPhoneModal(false);
                } catch (err: any) {
                        console.error("Error updating profile:", err);
                        setError(err.message || "Failed to update profile.");
                        throw err;
                } finally {
                        setIsSaving(false);
                }
        };

        return {
                user,
                isLoading,
                isSaving,
                error,
                showPhoneModal,
                setShowPhoneModal,
                logout,
                updateProfile,
        };
};
