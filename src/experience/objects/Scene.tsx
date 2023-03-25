import * as THREE from 'three'
import { BufferGeometry, Float32BufferAttribute } from 'three'
import { useRef } from 'react'

import {
  Environment,
  Float,
  OrthographicCamera,
  useFBO,
} from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

import { useControls } from 'leva'

import Bunny from '#/Bunny'
import fragmentShader from '#/fragment.glsl'
import Mug from '#/Mug'
import Suzanne from '#/Suzanne'
import Transition, { TransitionAPI } from '#/Transition'
import vertexShader from '#/vertex.glsl'
import MetalMaterial from '$/materials/Metal'

const getFullscreenTriangle = () => {
  const geometry = new BufferGeometry()

  geometry.setAttribute(
    'position',
    new Float32BufferAttribute([-1, -1, 3, -1, -1, 3], 2),
  )

  geometry.setAttribute('uv', new Float32BufferAttribute([0, 0, 2, 0, 0, 2], 2))

  return geometry
}

function interpolate(t: number, startT: number, endT: number, spread: number) {
  if (t < startT - spread) {
    return 0
  } else if (t <= startT + spread) {
    const ratio = (t - (startT - spread)) / (2 * spread)

    return ratio
  } else if (t < endT - spread) {
    return 1
  } else if (t <= endT + spread) {
    const ratio = 1 - (t - (endT - spread)) / (2 * spread)

    return ratio
  } else {
    return 0
  }
}

export default function Scene() {
  const { timeScale, spread } = useControls({
    timeScale: {
      value: 0.5,
      min: 0,
      max: 10,
    },
    spread: {
      value: 20,
      min: 0,
      max: 100,
    },
  })

  const transitionARef = useRef<TransitionAPI | null>(null)
  const transitionBRef = useRef<TransitionAPI | null>(null)
  const transitionCRef = useRef<TransitionAPI | null>(null)

  const screenCamera = useRef<THREE.OrthographicCamera | null>(null)
  const screenMesh = useRef<THREE.Mesh | null>(null)

  const renderTargetA = useFBO()
  const renderTargetB = useFBO()
  const renderTargetC = useFBO()

  useFrame(({ gl, camera, clock }) => {
    if (
      !transitionARef.current ||
      !transitionBRef.current ||
      !transitionCRef.current
    )
      return
    if (!screenMesh.current) return
    const material = screenMesh.current.material as THREE.ShaderMaterial
    if (!material) return
    const t = clock.elapsedTime * timeScale
    transitionARef.current.setT(t)
    transitionBRef.current.setT(t)
    transitionCRef.current.setT(t)
    const scene1 = transitionARef.current.scene
    const scene2 = transitionBRef.current.scene
    const scene3 = transitionCRef.current.scene
    // console.log(camera)

    if (!scene1 || !scene2 || !scene3) return
    gl.setRenderTarget(renderTargetA)
    gl.render(scene1, camera)

    gl.setRenderTarget(renderTargetB)
    gl.render(scene2, camera)

    gl.setRenderTarget(renderTargetC)
    gl.render(scene3, camera)

    material.uniforms.textureA.value = renderTargetA.texture
    material.uniforms.textureB.value = renderTargetB.texture
    material.uniforms.textureC.value = renderTargetC.texture

    const offset = 0.2
    const x = (t % (3 + offset * 2)) - offset

    material.uniforms.fadeA.value =
      interpolate(x, 0, 1, offset) + interpolate(x, 3, 4, offset)
    material.uniforms.fadeB.value = interpolate(x, 1, 2, offset)
    material.uniforms.fadeC.value = interpolate(x, 2, 3, offset)

    gl.setRenderTarget(null)
  })

  const animationA = (t: number) => ({
    x: Math.sin(t) * spread,
    y: Math.cos(t) * spread,
    r: t * 0.6,
  })

  const animationB = (t: number) => ({
    x: Math.sin(t) * spread,
    y: Math.cos(t) * spread,
    r: t,
  })

  const animationC = (t: number) => ({
    x: (Math.abs((t % 2) - 1) - 0.5) * spread,
    y: 0,
    r: t * 1.2,
  })

  return (
    <>
      <OrthographicCamera ref={screenCamera} args={[-1, 1, 1, -1, 0, 1]} />
      <mesh
        ref={screenMesh}
        geometry={getFullscreenTriangle()}
        frustumCulled={false}
      >
        <shaderMaterial
          uniforms={{
            textureA: {
              value: null,
            },
            textureB: {
              value: null,
            },
            textureC: {
              value: null,
            },
            fadeA: {
              value: 0,
            },
            fadeB: {
              value: 0,
            },
            fadeC: {
              value: 0,
            },
          }}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>

      <Transition ref={transitionARef} color='#15f2fd' animation={animationA}>
        <Bunny>
          <MetalMaterial />
        </Bunny>
      </Transition>
      <Transition ref={transitionBRef} color='red' animation={animationB}>
        <Suzanne>
          <MetalMaterial />
        </Suzanne>
      </Transition>
      <Transition ref={transitionCRef} color='green' animation={animationC}>
        <Mug>
          <MetalMaterial />
        </Mug>
      </Transition>
    </>
  )
}
