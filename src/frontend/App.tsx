import React, { useState, useEffect } from 'react';

interface Subject {
    code: string; // Changed to code
    name: string;
}

// A simple SVG spinner component defined outside the main component to prevent re-creation on re-renders.
const Spinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const App: React.FC = () => {
    const [name, setName] = useState<string>('');
    const [whatsapp, setWhatsapp] = useState<string>('');
    const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [subjectsLoading, setSubjectsLoading] = useState<boolean>(true);
    const [subjectsError, setSubjectsError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const response = await fetch(`http://${window.location.hostname}:8000/subjects/`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data: Subject[] = await response.json();
                setSubjects(data);
            } catch (error) {
                console.error("Error fetching subjects:", error);
                setSubjectsError("No se pudieron cargar las asignaturas.");
            } finally {
                setSubjectsLoading(false);
            }
        };

        fetchSubjects();
    }, []);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;
        setSelectedClasses(prev =>
            checked ? [...prev, value] : prev.filter(item => item !== value)
        );
    };

    const resetForm = () => {
        setName('');
        setWhatsapp('');
        setSelectedClasses([]);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        if (selectedClasses.length === 0) {
            setError('Por favor, selecciona al menos una clase.');
            setIsLoading(false);
            return;
        }

        const payload = {
            name: name,
            phone: '34' + whatsapp,
            subject_codes: selectedClasses
        };

        try {
            const response = await fetch(`http://${window.location.hostname}:8000/subscriptions/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                setSuccess('¡Suscripción actualizada con éxito! Gracias.');
                resetForm();
            } else {
                const errorData = await response.json().catch(() => ({ message: 'La suscripción falló. Por favor, inténtalo de nuevo.' }));
                setError(errorData.message || 'La suscripción falló. Por favor, inténtalo de nuevo.');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Ocurrió un error al conectar con el servidor. Por favor, inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen text-gray-200 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-slate-900/70 backdrop-blur-xl p-8 rounded-2xl shadow-2xl space-y-6 border border-slate-700/50 flex flex-col max-h-[calc(100vh-2rem)]">
                <div className="text-center flex-shrink-0">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 mb-2">¡Suscríbete a Iris!</h1>
                    <p className="text-slate-400">¡Selecciona tus clases y mantente al día!</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 flex flex-col flex-grow min-h-0">
                    <div className="space-y-4 flex-shrink-0">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">¿Cómo quieres que Iris se dirija hacia tí?</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full px-4 py-2 bg-slate-800/80 border border-slate-600 rounded-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                placeholder="p. ej., Juanito"
                            />
                        </div>
                        <div>
                            <label htmlFor="whatsapp" className="block text-sm font-medium text-slate-300 mb-2">Número de WhatsApp</label>
                            <div className="flex">
                                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-600 bg-slate-700 text-slate-300 text-sm">
                                    +34
                                </span>
                                <input
                                    type="tel"
                                    id="whatsapp"
                                    name="whatsapp"
                                    value={whatsapp}
                                    onChange={(e) => setWhatsapp(e.target.value)}
                                    required
                                    pattern="[0-9]{9}"
                                    title="Por favor, introduce un número de teléfono español de 9 dígitos."
                                    className="w-full px-4 py-2 bg-slate-800/80 border border-slate-600 rounded-r-md text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    placeholder="612345678"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col flex-grow min-h-0">
                        <label className="block text-sm font-medium text-slate-300 mb-3 flex-shrink-0">Selecciona las Clases</label>
                        {subjectsLoading && <p className="text-slate-400">Cargando asignaturas...</p>}
                        {subjectsError && <p className="text-red-500">Error: {subjectsError}</p>}
                        {!subjectsLoading && !subjectsError && subjects.length === 0 && <p className="text-slate-400">No hay asignaturas disponibles.</p>}
                        <div className="overflow-y-auto pr-2 custom-scrollbar">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {subjects.map((subject) => {
                                    const isChecked = selectedClasses.includes(subject.code);
                                    return (
                                        <label
                                            key={subject.code}
                                            htmlFor={subject.code}
                                            className={`flex items-center p-3 rounded-lg border transition-all duration-200 cursor-pointer ${
                                                isChecked
                                                    ? 'border-blue-500 bg-gradient-to-br from-slate-800 to-blue-900/30 shadow-lg'
                                                    : 'border-slate-700 bg-slate-800/50 hover:bg-slate-700/70'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                id={subject.code}
                                                name="classes"
                                                value={subject.code} // Changed from subject.name
                                                checked={isChecked}
                                                onChange={handleCheckboxChange}
                                                className="sr-only"
                                            />
                                            <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center mr-3 transition-all duration-200 ${
                                                    isChecked ? 'bg-blue-500 border-blue-600' : 'border-slate-500 bg-transparent'
                                                }`}
                                            >
                                                {isChecked && (
                                                    <svg className="w-3 h-3 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                )}
                                            </div>
                                            <span className={`text-sm select-none transition-colors ${
                                                    isChecked ? 'font-semibold text-white' : 'text-slate-300'
                                                }`}
                                            >
                                                {subject.name}
                                            </span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-shrink-0 pt-2">
                        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
                        {success && <p className="text-green-500 text-sm text-center mb-4">{success}</p>}
                        <button
                            type="submit"
                            disabled={isLoading || subjectsLoading}
                            className="w-full flex justify-center items-center px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Spinner /> : 'Suscribirse Ahora'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default App;