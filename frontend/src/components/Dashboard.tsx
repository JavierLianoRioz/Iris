import React, { useState, useEffect, type ReactNode } from 'react';
import { googleLogout } from '@react-oauth/google';
import { UserHeader, SubscriptionCard, Modal } from './index';
import { api } from '../services/api'; // Import the API service
import PhoneOnboardingModal from './dashboard/PhoneOnboardingModal';
import EditProfileModal from './dashboard/EditProfileModal';

// Extend the User interface to include subjects from the backend API
interface User {
  name: string;
  email: string;
  picture: string;
  phone?: string;
  subjects?: BackendSubject[]; // Subjects as returned by the backend for the user
}

// Define the Subject interface as it comes from the backend
interface BackendSubject {
    code: string;
    name: string;
}

// Define the Subject interface for the frontend display, including 'subscribed' status
interface FrontendSubject {
    id: string; // Maps to BackendSubject.code
    name: string;
    subscribed: boolean;
}

interface DashboardProps {
    children?: ReactNode;
}

export default function Dashboard({ children }: DashboardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [allSubjects, setAllSubjects] = useState<BackendSubject[]>([]); // All subjects from backend
  const [subjects, setSubjects] = useState<FrontendSubject[]>([]); // Subjects with subscribed status for display
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Initial Load and Sync
  useEffect(() => {
    const loadUser = async () => {
      const storedUserStr = localStorage.getItem('irisUser');
      if (!storedUserStr) {
        window.location.href = '/';
        return;
      }

      const parsedUser = JSON.parse(storedUserStr);
      
      // Optimistically set user from local storage first
      setUser(parsedUser);
      setNameInput(parsedUser.name);

      // Sync with backend
      try {
        const backendUser = await api.getUser(parsedUser.email);
        if (backendUser) {
            // Merge local user (Google profile) with backend data (phone, subjects)
            const updatedUser = {
                ...parsedUser,
                phone: backendUser.phone,
                subjects: backendUser.subjects,
            };
            setUser(updatedUser);
            localStorage.setItem('irisUser', JSON.stringify(updatedUser));
            
            // Check if phone is missing in backend data to show modal
            if (!backendUser.phone) {
                setShowPhoneModal(true);
            }
        } else {
            // User not found in backend (should be rare if created on login, but possible)
            // In this case, rely on local storage check or show modal
             if (!parsedUser.phone) setShowPhoneModal(true);
        }
      } catch (err) {
        console.error("Error syncing user with backend:", err);
        // Fallback to local check if sync fails
        if (!parsedUser.phone) setShowPhoneModal(true);
      }
    };

    loadUser();
  }, []);

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem('irisUser');
    window.location.href = '/';
  };

  const handleOpenEditModal = () => {
    if (user) {
      setNameInput(user.name);
      setPhoneInput(user.phone || '');
      setPhoneError('');
      setShowEditModal(true);
    }
  };

  const handleSaveProfile = async () => {
    const cleanPhone = phoneInput.replace(/\D/g, '');
    if (cleanPhone.length < 9) {
      setPhoneError('Por favor, introduce un número válido.');
      return;
    }
    if (!nameInput.trim()) {
        setPhoneError('El nombre no puede estar vacío.');
        return;
    }

    if (user) {
        setIsSavingProfile(true);
        try {
            const subscribedSubjectCodes = subjects.filter(s => s.subscribed).map(s => s.id);
            const updatedBackendUser = await api.updateSubscription({
                email: user.email,
                name: nameInput,
                phone: cleanPhone,
                subjects: subscribedSubjectCodes,
            });

            // Update local user state with the response from the backend
            const updatedUser = { 
                ...user, 
                name: updatedBackendUser.name, 
                phone: updatedBackendUser.phone, 
                subjects: updatedBackendUser.subjects // Backend returns BackendSubject[]
            };
            setUser(updatedUser);
            localStorage.setItem('irisUser', JSON.stringify(updatedUser));
            setShowEditModal(false);
            setShowPhoneModal(false);
            setPhoneError(''); // Clear any previous errors
        } catch (err: any) {
            console.error("Error saving profile:", err);
            setPhoneError(err.message || "Failed to save profile.");
        } finally {
            setIsSavingProfile(false);
        }
    }
  };

  const handleSaveSubscriptions = async () => {
    if (!user) return;
    setIsSavingProfile(true);
    try {
      const subscribedSubjectCodes = subjects.filter(s => s.subscribed).map(s => s.id);
      const updatedBackendUser = await api.updateSubscription({
        email: user.email,
        name: user.name, // Ensure name is passed
        phone: user.phone || '', 
        subjects: subscribedSubjectCodes,
      });

      // Update local user state with the response from the backend
      const updatedUser = { 
          ...user, 
          subjects: updatedBackendUser.subjects // Backend returns BackendSubject[]
      };
      setUser(updatedUser);
      localStorage.setItem('irisUser', JSON.stringify(updatedUser));
      // Optionally show a success message
    } catch (err: any) {
      console.error("Error saving subscriptions:", err);
      setError(err.message || "Failed to save subscriptions."); // Display error in main dashboard
    } finally {
      setIsSavingProfile(false);
    }
  };


  // Fetch subjects from backend
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setIsLoading(true);
        const fetchedSubjects = await api.getSubjects();
        setAllSubjects(fetchedSubjects);
        setError(null);
      } catch (err) {
        console.error("Error fetching subjects:", err);
        setError("Failed to load subjects. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // Combine allSubjects with user's subscriptions
  useEffect(() => {
    if (user && allSubjects.length > 0) {
      const userSubscribedCodes = new Set(user.subjects?.map(s => s.code) || []);
      const combinedSubjects: FrontendSubject[] = allSubjects.map(backendSub => ({
        id: backendSub.code,
        name: backendSub.name,
        subscribed: userSubscribedCodes.has(backendSub.code),
      }));
      setSubjects(combinedSubjects);
    } else if (allSubjects.length > 0 && !user) {
      // If user is not loaded yet but subjects are, display them as unsubscribed
      const combinedSubjects: FrontendSubject[] = allSubjects.map(backendSub => ({
        id: backendSub.code,
        name: backendSub.name,
        subscribed: false,
      }));
      setSubjects(combinedSubjects);
    }
  }, [user, allSubjects]);

  const toggleSubject = (id: string) => {
    setSubjects(prevSubjects => 
      prevSubjects.map(s => 
        s.id === id ? { ...s, subscribed: !s.subscribed } : s
      )
    );
  };

  if (!user || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
         <div className="w-12 h-12 rounded-full border-2 border-indigo-100 border-t-indigo-600 animate-spin"></div>
      </div>
    ); 
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4 text-red-600 text-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 lg:p-12 relative">
      
      {/* Onboarding Modal */}
      <Modal 
        isOpen={showPhoneModal} 
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
                    placeholder="+34 600 000 000"
                    value={phoneInput}
                    onChange={(e) => { setPhoneInput(e.target.value); setPhoneError(''); }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-slate-900"
                />
                {phoneError && <p className="text-red-500 text-xs mt-2 font-medium">{phoneError}</p>}
            </div>
            <button onClick={handleSaveProfile} disabled={isSavingProfile} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {isSavingProfile ? 'Guardando...' : 'Continuar'}
            </button>

         </div>
      </Modal>

      {/* Edit Profile Modal */}
      <Modal isOpen={showEditModal} title="Editar Perfil" onClose={() => setShowEditModal(false)}>
         <div className="space-y-4">
            <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-slate-700 mb-1">Nombre completo</label>
                <input 
                    type="text" 
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-slate-900"
                />
            </div>
            <div>
                <label htmlFor="edit-phone" className="block text-sm font-medium text-slate-700 mb-1">Número de teléfono</label>
                <input 
                    type="tel" 
                    value={phoneInput}
                    onChange={(e) => { setPhoneInput(e.target.value); setPhoneError(''); }}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 outline-none transition-all text-slate-900"
                />
                {phoneError && <p className="text-red-500 text-xs mt-2 font-medium">{phoneError}</p>}
            </div>
            <div className="pt-2 flex gap-3">
                <button onClick={() => setShowEditModal(false)} className="flex-1 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold py-3 rounded-xl transition-all">Cancelar</button>
                <button onClick={handleSaveProfile} disabled={isSavingProfile} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSavingProfile ? 'Guardando...' : 'Guardar'}
                </button>
            </div>
         </div>
      </Modal>

      <UserHeader user={user} onLogout={handleLogout} onEditProfile={handleOpenEditModal} />
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="text-lg font-semibold text-slate-900">Mis Suscripciones</h3>
                    <p className="text-sm text-slate-500 mt-1">Elige las asignaturas para recibir notificaciones WhatsApp.</p>
                </div>
                
                <div className="p-6 grid gap-4 sm:grid-cols-2">
                    {subjects.map(subject => (
                        <SubscriptionCard key={subject.id} subject={subject} onToggle={toggleSubject} />
                    ))}
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button 
                        onClick={handleSaveSubscriptions}
                        disabled={isSavingProfile}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSavingProfile ? 'Guardando...' : 'Guardar Cambios'}
                        {!isSavingProfile && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </div>

        {children}
      </div>
    </div>
  );
}