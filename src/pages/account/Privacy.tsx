import React from 'react';
import GlassCard from '../../components/GlassCard';

export default function Privacy() {
    const btnStyle = "w-full text-left bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-lg transition-colors";
    const btnDangerStyle = "w-full text-left bg-red-500/20 hover:bg-red-500/40 text-red-300 font-bold py-3 px-4 rounded-lg transition-colors";
    
    return (
        <GlassCard>
            <h2 className="text-2xl font-bold mb-6">Privacidad & Datos</h2>
            <div className="space-y-4">
                <p className="text-sm text-white/70">Gestiona tus datos personales de acuerdo con el GDPR.</p>
                <button className={btnStyle}>Descargar mis datos</button>
                <button className={btnDangerStyle}>Eliminar mi cuenta</button>
                <p className="text-xs text-white/60 pt-2">La eliminación de la cuenta es irreversible y se procesará en un plazo de 30 días.</p>
            </div>
        </GlassCard>
    );
}
