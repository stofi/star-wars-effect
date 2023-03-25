import * as THREE from 'three'
import { useRef } from 'react'

import { Environment, Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import { useControls } from 'leva'

import Bunny from '#/Bunny'
import Mug from '#/Mug'
import Suzanne from '#/Suzanne'
import MetalMaterial from '$/materials/Metal'

const sphere = new THREE.SphereGeometry(1, 16, 16)

const topMaterial = new THREE.MeshBasicMaterial({
  color: '#202020',
  side: THREE.BackSide,
  transparent: true,
  opacity: 0.25,
})

const bottomMaterial = new THREE.MeshBasicMaterial({
  color: '#020202',
  side: THREE.BackSide,
  transparent: true,
  opacity: 0.25,
})

const stick = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 16)
const stickBlue = new THREE.MeshBasicMaterial({ color: '#15f2fd' })
const stickRed = new THREE.MeshBasicMaterial({ color: '#f00' })

const smoothstep = (x: number, min: number, max: number) => {
  if (x <= min) return 0
  if (x >= max) return 1

  x = (x - min) / (max - min)

  return x * x * (3 - 2 * x)
}

export default function Scene() {
  // const redLightRef = useRef<THREE.PointLight | null>(null)
  // const blueLightRef = useRef<THREE.PointLight | null>(null)
  const bunnyMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null)
  const mugMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null)
  const suzanneMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null)

  const bunnyRef = useRef<THREE.Group | null>(null)
  const mugRef = useRef<THREE.Group | null>(null)
  const suzanneRef = useRef<THREE.Group | null>(null)

  const stickBlueRef = useRef<THREE.Mesh | null>(null)
  const stickRedRef = useRef<THREE.Mesh | null>(null)

  const { spread, timeScale } = useControls({
    spread: {
      value: 40,
      min: 0,
      max: 100,
    },

    timeScale: {
      value: 0.5,
      min: 0,
      max: 10,
    },
  })

  const getOpacity = (time: number) => {
    let t = time
    t = t % 1

    let o = Math.sin(t * Math.PI)
    o = Math.pow(o, 0.8)
    o = smoothstep(o, 0, 0.75)

    return o
  }

  const handleBunny = (time: number) => {
    if (!bunnyMaterialRef.current || !bunnyRef.current) return

    const x = time % 3

    if (x < 0 || x > 1) {
      bunnyRef.current.visible = false

      return
    }
    bunnyRef.current.visible = true

    bunnyMaterialRef.current.opacity = getOpacity(time)
  }

  const handleMug = (time: number) => {
    if (!mugMaterialRef.current || !mugRef.current) return

    const x = time % 3

    if (x < 2 || x > 3) {
      mugRef.current.visible = false

      return
    }

    mugRef.current.visible = true

    mugMaterialRef.current.opacity = getOpacity(time)
  }

  const handleSuzanne = (time: number) => {
    if (!suzanneMaterialRef.current || !suzanneRef.current) return

    const x = time % 3

    if (x < 1 || x > 2) {
      suzanneRef.current.visible = false

      return
    }

    suzanneRef.current.visible = true

    suzanneMaterialRef.current.opacity = getOpacity(time)
  }

  const handleBlueStick = (time: number) => {
    if (!stickBlueRef.current) return

    let t = time
    t = t % 1

    stickBlueRef.current.visible = true

    const o = Math.cos(t * Math.PI)

    stickBlueRef.current.position.y = o * spread
    stickBlueRef.current.position.x = o * spread

    stickBlueRef.current.rotation.z = t * Math.PI

    const x = time % 3

    if (x > 1 && x < 2) {
      stickBlueRef.current.visible = false
    } else {
      stickBlueRef.current.visible = true
    }
  }

  const handleRedStick = (time: number) => {
    if (!stickRedRef.current) return

    let t = time
    t = t % 1

    stickRedRef.current.visible = true
    stickRedRef.current.position.y = -Math.cos(t * Math.PI) * spread
    stickRedRef.current.position.x = Math.sin(t * Math.PI) * spread

    stickRedRef.current.rotation.z = t * Math.PI * -0.7

    const x = time % 3

    if (x < 1 || x > 2) {
      stickRedRef.current.visible = false
    } else {
      stickRedRef.current.visible = true
    }
  }

  useFrame((scene) => {
    const time = scene.clock.elapsedTime * timeScale
    handleBunny(time)
    handleSuzanne(time)
    handleMug(time)
    // handleMug(time)
    handleBlueStick(time)
    handleRedStick(time)
  })

  return (
    <>
      <Environment
        frames={Infinity}
        background={false}
        // frames={1}
        near={1}
        far={1000}
        resolution={1024 / 4}
      >
        <mesh
          scale={10}
          position={[5, 10, -10]}
          geometry={sphere}
          material={topMaterial}
        />
        <mesh scale={100} geometry={sphere} material={bottomMaterial} />
        <mesh
          scale={100}
          ref={stickBlueRef}
          position={[0, 0, 15]}
          geometry={stick}
          material={stickBlue}
          rotation={[0, 0, Math.PI / 3]}
        />
        <mesh
          scale={100}
          ref={stickRedRef}
          position={[0, 0, 15]}
          geometry={stick}
          material={stickRed}
          rotation={[0, 0, -Math.PI / 3]}
        />
      </Environment>

      {/* <pointLight
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
      /> */}

      <Float rotationIntensity={0.2} speed={4} floatIntensity={0.1}>
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
