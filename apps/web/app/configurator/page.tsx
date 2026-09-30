import type { Metadata } from 'next';
import FrameConfigurator from '@/components/configurator/FrameConfigurator';

export const metadata: Metadata = {
  title: 'Configurateur — Créez votre cadre sur-mesure | FrameItUp',
  description:
    'Configurez votre cadre artisanal en temps réel. Choisissez format ISO, moulure, passe-partout, verre et visualisez en 2.5D Studio, Room View ou 3D.',
};

export default function ConfiguratorPage() {
  return <FrameConfigurator />;
}
