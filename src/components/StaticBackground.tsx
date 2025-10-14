import { StaticMeshGradient } from '@paper-design/shaders-react';

const StaticBackground = ({ children }: { children: React.ReactNode }) => {
  return (
    <StaticMeshGradient
      className='min-h-dvh absolute w-full bg-gray-800'
      colors={['#000000', '#4f4f4f', '#737373']}
      positions={0}
      waveX={0.53}
      waveXShift={0}
      waveY={0.95}
      waveYShift={0.64}
      mixing={0.5}
      grainMixer={0}
      grainOverlay={0}
    >
      {children}
    </StaticMeshGradient>
  );
};

export default StaticBackground;
