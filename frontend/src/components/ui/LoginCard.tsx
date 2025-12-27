import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

interface LoginCardProps {
    error: string | null;
    clientId: string;
    onSuccess: (response: any) => void;
    onError: () => void;
    hostedDomain?: string;
}

export default function LoginCard({ error, clientId, onSuccess, onError, hostedDomain }: LoginCardProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4 relative overflow-hidden">
            
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[100px] -z-10"></div>
            
            <div className="w-full max-w-md bg-white/80 backdrop-blur-2xl rounded-2xl shadow-xl shadow-slate-200/50 border border-white/50 p-10 text-center relative z-10">
            
            <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 ring-4 ring-indigo-50/50">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">Bienvenido a Iris</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
                Gestiona tus notificaciones universitarias de forma inteligente y rápida.
            </p>
            
            {error && (
                <div className="mb-8 p-4 bg-red-50/50 backdrop-blur-sm text-red-600 text-sm rounded-xl border border-red-100 flex items-center gap-3 text-left">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
                </div>
            )}

            <div className="flex justify-center transform transition-transform hover:scale-105 duration-200">
                <GoogleOAuthProvider clientId={clientId}>
                <GoogleLogin
                    onSuccess={onSuccess}
                    onError={onError}
                    useOneTap
                    theme="filled_blue"
                    shape="pill"
                    text="signin_with"
                    width="100%"
                    hosted_domain={hostedDomain}
                />
                </GoogleOAuthProvider>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                </svg>
                <span>Acceso exclusivo @alumnos.uneatlantico.es</span>
            </div>
            </div>
        </div>
    );
}
