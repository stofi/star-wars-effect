// @ts-nocheck
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  Noise,
  Vignette,
} from '@react-three/postprocessing'

import { useControls } from 'leva'

export default function Effects() {
  const { enableBloom, enableDepthOfField, enableNoise, enableVignette } =
    useControls('Effects', {
      enableBloom: {
        value: true,
        label: 'Bloom',
      },
      enableDepthOfField: {
        value: false,
        label: 'Depth of Field',
      },
      enableNoise: {
        value: true,
        label: 'Noise',
      },
      enableVignette: {
        value: true,
        label: 'Vignette',
      },
    })

  return (
    <EffectComposer>
      {enableDepthOfField && (
        <DepthOfField
          worldFocusDistance={10}
          focalLength={0.02}
          bokehScale={20}
          height={1024}
        />
      )}
      {enableBloom && (
        <Bloom
          luminanceThreshold={0.5}
          luminanceSmoothing={0.9}
          height={1024}
        />
      )}
      {enableNoise && <Noise opacity={0.015} />}
      {enableVignette && <Vignette eskil={false} offset={0.1} darkness={0.8} />}
    </EffectComposer>
  )
}
