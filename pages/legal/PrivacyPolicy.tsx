import React from 'react';
import GlassCard from '../../components/GlassCard';

export default function PrivacyPolicy() {
  return (
    <GlassCard className="text-white/80">
      <h2 className="text-2xl font-bold mb-4 text-white">Política de Privacidad</h2>
      <div className="space-y-3">
        <p><strong>Responsable del tratamiento:</strong> Moon Shared Living S.L., con CIF B12345678 y domicilio en Passeig de Gràcia 50, 08007 Barcelona, España. Email de contacto: <a href="mailto:privacy@moonsharedliving.com" className="text-cyan-400 hover:underline">privacy@moonsharedliving.com</a>.</p>
        <p><strong>Finalidad:</strong> gestionar las cuentas de usuario, facilitar la conexión entre inquilinos y propietarios, y enviar comunicaciones relacionadas con el servicio o marketing (si se ha consentido).</p>
      </div>
    </GlassCard>
  );
}