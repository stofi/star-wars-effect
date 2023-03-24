import { Suspense } from 'react'

import { PerformanceMonitor } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Debug, Physics } from '@react-three/rapier'

import { Leva } from 'leva'
import { Perf } from 'r3f-perf'

import Scene from '#/Scene'

import Effects from './Effects'

export default function Experience(props: { enableDebug?: boolean }) {
  return (
    <>
      <Leva hidden={!props.enableDebug} />
      <Canvas
        flat={false}
        shadows={false}
        dpr={2}
        camera={{ position: [0, 0, 10], fov: 15 }}
      >
        {/* <color args={['lightblue']} attach='background' /> */}
        {props.enableDebug && (
          <>
            <axesHelper args={[5]} />
            <Perf position='top-left' />
            <PerformanceMonitor />
          </>
        )}
        <Suspense>
          <Physics>
            {props.enableDebug && <Debug />}
            <Effects />
            <Scene />
          </Physics>
        </Suspense>
      </Canvas>
    </>
  )
}
