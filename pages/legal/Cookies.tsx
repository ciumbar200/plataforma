import React from 'react';
import GlassCard from '../../components/GlassCard';

export default function Cookies() {
  return (
    <GlassCard className="text-white/80">
      <h2 className="text-2xl font-bold mb-4 text-white">Política de Cookies</h2>
      <p>Este sitio utiliza cookies técnicas (esenciales para el funcionamiento) y analíticas (para medir el uso del servicio de forma anónima). Puede configurar su navegador para aceptar o rechazar las cookies. Para más información, contacte con <a href="mailto:privacy@moonsharedliving.com" className="text-cyan-400 hover:underline">privacy@moonsharedliving.com</a>.</p>
    </GlassCard>
  );
}