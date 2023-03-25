import * as THREE from 'three'
import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'

import { Environment, Float } from '@react-three/drei'
import { createPortal, GroupProps, useFrame } from '@react-three/fiber'

const sphere = new THREE.SphereGeometry(1, 16, 16)

const topMaterial = new THREE.MeshBasicMaterial({
  color: '#404040',
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

const stick = new THREE.CylinderGeometry(0.05, 0.05, 1, 4)

export interface TransitionAPI {
  hide: () => void
  show: () => void
  scene: THREE.Scene | null
}

interface TransitionProps extends GroupProps {
  color: string

  animation: () => { x: number; y: number; r: number }
}

const Transition = forwardRef<TransitionAPI, TransitionProps>(function Scene(
  props,
  ref,
) {
  const groupRef = useRef<THREE.Group | null>(null)

  const stickRef = useRef<THREE.Mesh | null>(null)
  const stickMaterialRef = useRef<THREE.MeshBasicMaterial | null>(null)

  const active = useRef(false)

  const scene = useMemo(() => new THREE.Scene(), [])

  useImperativeHandle(ref, () => ({
    hide: () => {
      if (groupRef.current) groupRef.current.visible = false
      if (stickRef.current) stickRef.current.visible = false
      active.current = false
    },
    show: () => {
      if (groupRef.current) groupRef.current.visible = true
      if (stickRef.current) stickRef.current.visible = true
      active.current = true
    },
    scene,
  }))

  const handleStick = () => {
    if (!stickRef.current) return

    const { x, y, r } = props.animation()
    stickRef.current.position.y = y
    stickRef.current.position.x = x
    stickRef.current.rotation.z = r * Math.PI
  }

  useFrame(() => {
    if (!active.current) {
      scene.visible = false

      return
    }
    scene.visible = true

    handleStick()
  })

  return createPortal(
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
          position={[3, 8, -15]}
          geometry={sphere}
          material={topMaterial}
        />
        <mesh scale={100} geometry={sphere} material={bottomMaterial} />
        <mesh
          scale={100}
          ref={stickRef}
          position={[0, 0, 15]}
          geometry={stick}
          rotation={[0, 0, Math.PI / 3]}
        >
          <meshBasicMaterial ref={stickMaterialRef} color={props.color} />
        </mesh>
      </Environment>

      <Float rotationIntensity={0.2} speed={4} floatIntensity={0.1}>
        <group ref={groupRef}>{props.children}</group>
      </Float>
    </>,
    scene,
  )
})

export default Transition
