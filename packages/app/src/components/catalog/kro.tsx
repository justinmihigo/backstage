import React from 'react';
import { Header } from '@backstage/core-components';
export const KroPage: React.FC = () => (
  <>
    <Header title="Kube Resource Orchestrator" />
    <iframe
      src="https://preview--kube-wizard-orchestrator-ai.lovable.app/"
      title="KRO Preview"
      style={{ width: '100%', height: '100vh', border: 'none' }}
    allow="fullscreen"
  />
  </>
);