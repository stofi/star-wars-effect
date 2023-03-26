import * as THREE from 'three'
import { BufferGeometry, Float32BufferAttribute } from 'three'
import { useEffect, useRef } from 'react'

import { OrthographicCamera, useFBO } from '@react-three/drei'
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
  const { timeScale, spread, renderA, renderB, renderC } = useControls({
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
    renderA: {
      value: false,
    },
    renderB: {
      value: false,
    },
    renderC: {
      value: false,
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

  useEffect(() => {
    if (transition1Ref.current) transition1Ref.current.show()
    if (transition2Ref.current) transition2Ref.current.show()
    if (transition3Ref.current) transition3Ref.current.show()
  })

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
    const t = (clock.elapsedTime * timeScale) % 6
    time.current = clock.elapsedTime * timeScale

    const scene1 = transition1Ref.current.scene
    const scene2 = transition2Ref.current.scene
    const scene3 = transition3Ref.current.scene
    // console.log(camera)
    let sceneA: THREE.Scene
    let sceneB: THREE.Scene
    if (!scene1 || !scene2 || !scene3) return

    if (renderA) {
      sceneA = scene1
      gl.setRenderTarget(renderTargetA)
      gl.render(sceneA, camera)
      material.uniforms.textureA.value = renderTargetA.texture
      material.uniforms.fadeA.value = 1
      material.uniforms.fadeB.value = 0

      gl.setRenderTarget(null)

      return
    }

    if (renderB) {
      sceneA = scene2
      gl.setRenderTarget(renderTargetA)
      gl.render(sceneA, camera)
      material.uniforms.textureA.value = renderTargetA.texture
      material.uniforms.fadeA.value = 1
      material.uniforms.fadeB.value = 0

      gl.setRenderTarget(null)

      return
    }

    if (renderC) {
      sceneA = scene3
      gl.setRenderTarget(renderTargetA)
      gl.render(sceneA, camera)
      material.uniforms.textureA.value = renderTargetA.texture
      material.uniforms.fadeA.value = 1
      material.uniforms.fadeB.value = 0

      gl.setRenderTarget(null)

      return
    }

    const o = 0.2

    if (t < 1 + o) {
      sceneA = scene1
    } else if (t < 3 + o) {
      sceneA = scene3
    } else if (t < 5 + o) {
      sceneA = scene2
    } else {
      sceneA = scene1
    }

    if (t < o) {
      sceneB = scene3
    } else if (t < 2 + o) {
      sceneB = scene2
    } else if (t < 4 + o) {
      sceneB = scene1
    } else {
      sceneB = scene3
    }

    gl.setRenderTarget(renderTargetA)
    gl.render(sceneA, camera)

    gl.setRenderTarget(renderTargetB)
    gl.render(sceneB, camera)

    material.uniforms.textureA.value = renderTargetA.texture
    material.uniforms.textureB.value = renderTargetB.texture

    material.uniforms.fadeA.value =
      interpolate(t, 0, 1, o) +
      interpolate(t, 2, 3, o) +
      interpolate(t, 4, 5, o) +
      interpolate(t, 6, 7, o)

    material.uniforms.fadeB.value =
      interpolate(t, 1, 2, o) +
      interpolate(t, 3, 4, o) +
      interpolate(t, 5, 6, o)

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
    r: time.current * 1.2,
  })

  const animationC = () => ({
    y: Math.abs((time.current % 1) - 0.5) * 2 * spread,
    x: Math.cos(time.current * Math.PI) * spread * 10,
    r: Math.sin(time.current) * 2,
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
            fadeA: {
              value: 0,
            },
            fadeB: {
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
