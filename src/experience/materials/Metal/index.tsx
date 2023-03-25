/* eslint-disable @typescript-eslint/no-unused-vars */
import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'
import { forwardRef, useRef } from 'react'

import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import { useControls } from 'leva'

import fragmentShader from './shaders/fragment.glsl'
import vertexShader from './shaders/vertex.glsl'

const textures = [
  './textures/metal/albedo.png',
  './textures/metal/roughness.png',
  './textures/metal/normal.png',
]

const textureHandler = (texture: THREE.Texture | THREE.Texture[]) => {
  if (Array.isArray(texture)) {
    texture.forEach(textureHandler)

    return
  }
  // texture.encoding = THREE.sRGBEncoding
  texture.encoding = THREE.LinearEncoding
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter

  texture.repeat.set(1, 1)

  texture.needsUpdate = true
}

const MetalMaterial = forwardRef<THREE.MeshPhysicalMaterial>(
  function CustomMaterial(props, ref) {
    const materialRef = useRef<THREE.ShaderMaterial | null>(null)

    const [albedo, roughness, normal] = useTexture(textures, textureHandler)

    return (
      <meshPhysicalMaterial
        ref={ref}
        color={'white'}
        map={albedo}
        roughnessMap={roughness}
        flatShading={false}
        metalness={1}
        normalMap={normal}
        transparent
        opacity={1}
        envMapIntensity={10}
      />
    )
  },
)

export default MetalMaterial
