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
  const { timeScale, spread, progress } = useControls({
    timeScale: {
      value: 0.8,
      min: 0,
      max: 10,
    },
    spread: {
      value: 20,
      min: 0,
      max: 100,
    },
    progress: {
      value: 0,
      min: 0,
      max: 3,
    },
  })

  const transition1Ref = useRef<TransitionAPI | null>(null)
  const transition2Ref = useRef<TransitionAPI | null>(null)
  const transition3Ref = useRef<TransitionAPI | null>(null)

  const screenCamera = useRef<THREE.OrthographicCamera | null>(null)
  const screenMesh = useRef<THREE.Mesh | null>(null)

  const renderTargetA = useFBO()
  const renderTargetB = useFBO()
  const time = useRef(0)

  useFrame(({ gl, camera, clock }) => {
    if (
      !transition1Ref.current ||
      !transition2Ref.current ||
      !transition3Ref.current
    )
      return
    if (!screenMesh.current) return
    const material = screenMesh.current.material as THREE.ShaderMaterial
    if (!material) return
    const t = (clock.elapsedTime * timeScale) % 12
    time.current = clock.elapsedTime * timeScale

    const scene1 = transition1Ref.current.scene
    const scene2 = transition2Ref.current.scene
    const scene3 = transition3Ref.current.scene
    // console.log(camera)
    let sceneA: THREE.Scene
    let sceneB: THREE.Scene
    if (!scene1 || !scene2 || !scene3) return

    if (t < 1.5) {
      transition1Ref.current.show()
      transition2Ref.current.hide()
      sceneA = scene3
      sceneB = scene1
    } else if (t < 3) {
      transition2Ref.current.show()
      transition3Ref.current.hide()
      sceneB = scene1
      sceneA = scene2
    } else if (t < 4.5) {
      transition3Ref.current.show()
      transition1Ref.current.hide()
      sceneA = scene2
      sceneB = scene3
    } else if (t < 6) {
      transition1Ref.current.show()
      transition2Ref.current.hide()
      sceneB = scene3
      sceneA = scene1
    } else if (t < 7.5) {
      transition2Ref.current.show()
      transition3Ref.current.hide()
      sceneA = scene1
      sceneB = scene2
    } else if (t < 9) {
      transition3Ref.current.show()
      transition1Ref.current.hide()
      sceneB = scene2
      sceneA = scene3
    } else {
      transition1Ref.current.show()
      transition2Ref.current.hide()
      sceneA = scene3
      sceneB = scene1
    }

    gl.setRenderTarget(renderTargetA)
    gl.render(sceneA, camera)

    gl.setRenderTarget(renderTargetB)
    gl.render(sceneB, camera)

    material.uniforms.textureA.value = renderTargetA.texture
    material.uniforms.textureB.value = renderTargetB.texture

    const x = t % 3
    material.uniforms.fade.value = interpolate(x, 1 - 1 / 3, 2 + 1 / 3, 0.2)

    gl.setRenderTarget(null)
  })

  const animationA = () => ({
    x: -Math.cos(time.current * Math.PI) * spread,
    y: -Math.cos(time.current * Math.PI) * spread,
    r: time.current * -0.5,
  })

  const animationB = () => ({
    x: Math.sin(time.current * Math.PI) * spread,
    y: -Math.cos(time.current * Math.PI) * spread,
    r: time.current * 0.7,
  })

  const animationC = () => ({
    x: Math.cos(time.current * Math.PI * 0.5) * spread,
    y: Math.cos(time.current * Math.PI) * spread * 2,
    r: time.current * 0.2,
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
            fade: {
              value: 0,
            },
          }}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>

      <Transition ref={transition1Ref} color='#15f2fd' animation={animationA}>
        <Bunny>
          <MetalMaterial />
        </Bunny>
      </Transition>
      <Transition ref={transition2Ref} color='red' animation={animationB}>
        <Suzanne>
          <MetalMaterial />
        </Suzanne>
      </Transition>
      <Transition ref={transition3Ref} color='green' animation={animationC}>
        <Mug>
          <MetalMaterial />
        </Mug>
      </Transition>
    </>
  )
}
