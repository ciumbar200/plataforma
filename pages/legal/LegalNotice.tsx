import React from 'react';
import GlassCard from '../../components/GlassCard';

export default function LegalNotice() {
  return (
    <GlassCard className="text-white/80">
      <h2 className="text-2xl font-bold mb-4 text-white">Aviso Legal</h2>
      <div className="space-y-1">
        <p><strong>Razón Social:</strong> Moon Shared Living S.L.</p>
        <p><strong>CIF:</strong> B12345678</p>
        <p><strong>Domicilio Social:</strong> Passeig de Gràcia 50, 08007 Barcelona, España.</p>
        <p><strong>Email de Contacto:</strong> <a href="mailto:help@moonsharedliving.com" className="text-cyan-400 hover:underline">help@moonsharedliving.com</a></p>
      </div>
    </GlassCard>
  );
}