import * as THREE from 'three'
import { useRef } from 'react'

import { Environment, Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import { useControls } from 'leva'

import Bunny from '#/Bunny'
import Mug from '#/Mug'
import Suzanne from '#/Suzanne'
import MetalMaterial from '$/materials/Metal'

export default function Scene() {
  const redLightRef = useRef<THREE.PointLight | null>(null)
  const blueLightRef = useRef<THREE.PointLight | null>(null)
  const bunnyMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null)
  const mugMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null)
  const suzanneMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null)

  const bunnyRef = useRef<THREE.Group | null>(null)
  const mugRef = useRef<THREE.Group | null>(null)
  const suzanneRef = useRef<THREE.Group | null>(null)

  const { spread, power, powerCurve, timeScale } = useControls({
    spread: {
      value: 40,
      min: 0,
      max: 100,
    },
    power: {
      value: 12,
      min: 0,
      max: 100,
    },
    powerCurve: {
      value: 1.4,
      min: 0,
      max: 10,
    },
    timeScale: {
      value: 0.8,
      min: 0,
      max: 10,
    },
  })

  const handleBunny = (time: number) => {
    if (!redLightRef.current || !bunnyMaterialRef.current || !bunnyRef.current)
      return

    let t = time
    t = t % 1
    const x = time % 3

    if (x < 0 || x > 1) {
      bunnyRef.current.visible = false

      return
    }
    bunnyRef.current.visible = true
    const p = (t - 0.5) * spread
    let o = Math.sin(t * Math.PI)
    o = Math.pow(o, powerCurve)
    o = Math.max(0, o)
    o = Math.min(1, o)

    redLightRef.current.position.x = p
    redLightRef.current.position.y = -p
    redLightRef.current.power = o * power
    bunnyMaterialRef.current.opacity = o
  }

  const handleMug = (time: number) => {
    if (!redLightRef.current || !mugMaterialRef.current || !mugRef.current)
      return

    let t = time
    t = t % 1
    const x = time % 3

    if (x < 2 || x > 3) {
      mugRef.current.visible = false

      return
    }

    mugRef.current.visible = true
    const p = (t - 0.5) * spread
    let o = Math.sin(t * Math.PI)
    o = Math.pow(o, powerCurve)
    o = Math.max(0, o)
    o = Math.min(1, o)

    redLightRef.current.position.x = p
    redLightRef.current.position.y = p
    redLightRef.current.power = o * power
    mugMaterialRef.current.opacity = o
  }

  const handleSuzanne = (time: number) => {
    if (
      !blueLightRef.current ||
      !suzanneMaterialRef.current ||
      !suzanneRef.current ||
      !redLightRef.current
    )
      return

    let t = time
    t = t % 1
    const x = time % 3

    if (x < 1 || x > 2) {
      suzanneRef.current.visible = false

      blueLightRef.current.power = 0

      return
    }

    redLightRef.current.power = 0

    suzanneRef.current.visible = true
    const p = (t - 0.5) * spread
    let o = Math.sin(t * Math.PI)
    o = Math.pow(o, powerCurve)
    o = Math.max(0, o)
    o = Math.min(1, o)

    blueLightRef.current.position.x = p
    blueLightRef.current.position.y = -p
    blueLightRef.current.power = o * power
    suzanneMaterialRef.current.opacity = o
  }

  useFrame((scene) => {
    const time = scene.clock.elapsedTime * timeScale
    handleBunny(time)
    handleSuzanne(time)
    handleMug(time)
    // handleMug(time)
  })

  return (
    <>
      <Environment
        background={false}
        // frames={1}
        near={1}
        far={1000}
        resolution={32}
      >
        <mesh scale={10} position={[5, 10, -10]}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshBasicMaterial
            opacity={1}
            transparent={true}
            side={THREE.BackSide}
            color='#333'
          />
        </mesh>
        <mesh scale={100}>
          <sphereGeometry args={[1, 64, 64]} />
          <meshBasicMaterial
            opacity={0.01}
            transparent={true}
            side={THREE.BackSide}
          />
        </mesh>
      </Environment>

      <pointLight
        ref={redLightRef}
        position={[0, 0, 10]}
        color='red'
        intensity={10}
      />
      <pointLight
        ref={blueLightRef}
        position={[0, 0, 10]}
        color='#15f2fd'
        intensity={10}
      />

      <Float rotationIntensity={0.2} speed={0.1}>
        <Bunny ref={bunnyRef} visible={false}>
          <MetalMaterial ref={bunnyMaterialRef} />
        </Bunny>
        <Suzanne ref={suzanneRef} visible={false}>
          <MetalMaterial ref={suzanneMaterialRef} />
        </Suzanne>
        <Mug ref={mugRef} visible={false}>
          <MetalMaterial ref={mugMaterialRef} />
        </Mug>
      </Float>
    </>
  )
}
