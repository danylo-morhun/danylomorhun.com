<!--
  Vendored from Vue Bits (https://vue-bits.dev/backgrounds/beams), MIT + Commons Clause.
  Copyright (c) 2025 David Haz. Used as part of this site per license terms (no resale/redistribution).
-->
<template>
  <div
    ref="containerRef"
    class="beams-container relative h-full w-full"
    :class="{ 'beams-inverted': colorMode.value === 'light', 'beams-ready': hasRendered }"
  />
</template>

<script setup lang="ts">
import {
  AmbientLight,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  ShaderLib,
  ShaderMaterial,
  UniformsUtils,
  WebGLRenderer,
} from 'three'
import type {
  IUniform,
  Material,
  MaterialParameters,
  MeshPhysicalMaterialParameters,
  OrthographicCamera,
  ShaderLibShader,
  Texture,
} from 'three'
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'

const { degToRad } = MathUtils

interface BeamsProps {
  beamWidth?: number
  beamHeight?: number
  beamNumber?: number
  lightColor?: string
  speed?: number
  noiseIntensity?: number
  scale?: number
  rotation?: number
}

const props = withDefaults(defineProps<BeamsProps>(), {
  beamWidth: 2,
  beamHeight: 15,
  beamNumber: 12,
  lightColor: '#ffffff',
  speed: 2,
  noiseIntensity: 1.75,
  scale: 0.2,
  rotation: 0,
})

const containerRef = useTemplateRef<HTMLDivElement>('containerRef')
const colorMode = useColorMode()

let renderer: WebGLRenderer | null = null
const hasRendered = ref(false)
let scene: Scene | null = null
let camera: PerspectiveCamera | null = null
let beamMesh: Mesh<BufferGeometry, ShaderMaterial> | null = null
let directionalLight: DirectionalLight | null = null
let ambientLight: AmbientLight | null = null
let animationId: number | null = null
let isVisible = true
let observer: IntersectionObserver | null = null
let resizeObserver: ResizeObserver | null = null
let startTimer: ReturnType<typeof setTimeout> | undefined
let idleHandle: number | undefined

type UniformValue = IUniform<unknown> | unknown

interface ExtendMaterialConfig {
  header: string
  vertexHeader?: string
  fragmentHeader?: string
  material?: MeshPhysicalMaterialParameters & { fog?: boolean }
  uniforms?: Record<string, UniformValue>
  vertex?: Record<string, string>
  fragment?: Record<string, string>
}

type ShaderWithDefines = ShaderLibShader & {
  defines?: Record<string, string | number | boolean>
}

const hexToNormalizedRGB = (hex: string): [number, number, number] => {
  const clean = hex.replace('#', '')
  const r = Number.parseInt(clean.substring(0, 2), 16)
  const g = Number.parseInt(clean.substring(2, 4), 16)
  const b = Number.parseInt(clean.substring(4, 6), 16)
  return [r / 255, g / 255, b / 255]
}

const noise = `
float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}
float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) +
           (c - a)* u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
}
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
float cnoise(vec3 P){
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;
  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
  vec4 norm0 = taylorInvSqrt(vec4(dot(g000,g000),dot(g010,g010),dot(g100,g100),dot(g110,g110)));
  g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001,g001),dot(g011,g011),dot(g101,g101),dot(g111,g111)));
  g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;
  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x,Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x,Pf1.y,Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy,Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy,Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x,Pf0.y,Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x,Pf1.yz));
  float n111 = dot(g111, Pf1);
  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000,n100,n010,n110),vec4(n001,n101,n011,n111),fade_xyz.z);
  vec2 n_yz = mix(n_z.xy,n_z.zw,fade_xyz.y);
  float n_xyz = mix(n_yz.x,n_yz.y,fade_xyz.x);
  return 2.2 * n_xyz;
}
`

function extendMaterial<T extends Material = Material>(
  BaseMaterial: new (params?: MaterialParameters) => T,
  cfg: ExtendMaterialConfig,
): ShaderMaterial {
  const physical = ShaderLib.physical as ShaderWithDefines
  const { vertexShader: baseVert, fragmentShader: baseFrag, uniforms: baseUniforms } = physical
  const baseDefines = physical.defines ?? {}

  const uniforms: Record<string, IUniform> = UniformsUtils.clone(baseUniforms)

  const defaults = new BaseMaterial(cfg.material || {}) as T & {
    color?: Color
    roughness?: number
    metalness?: number
    envMap?: Texture
    envMapIntensity?: number
  }

  if (defaults.color) uniforms.diffuse!.value = defaults.color
  if ('roughness' in defaults) uniforms.roughness!.value = defaults.roughness
  if ('metalness' in defaults) uniforms.metalness!.value = defaults.metalness
  if ('envMap' in defaults) uniforms.envMap!.value = defaults.envMap
  if ('envMapIntensity' in defaults) uniforms.envMapIntensity!.value = defaults.envMapIntensity

  Object.entries(cfg.uniforms ?? {}).forEach(([key, u]) => {
    uniforms[key]
      = u !== null && typeof u === 'object' && 'value' in u
        ? (u as IUniform<unknown>)
        : ({ value: u } as IUniform<unknown>)
  })

  let vert = `${cfg.header}\n${cfg.vertexHeader ?? ''}\n${baseVert}`
  let frag = `${cfg.header}\n${cfg.fragmentHeader ?? ''}\n${baseFrag}`

  for (const [inc, code] of Object.entries(cfg.vertex ?? {})) {
    vert = vert.replace(inc, `${inc}\n${code}`)
  }
  for (const [inc, code] of Object.entries(cfg.fragment ?? {})) {
    frag = frag.replace(inc, `${inc}\n${code}`)
  }

  const mat = new ShaderMaterial({
    defines: { ...baseDefines },
    uniforms,
    vertexShader: vert,
    fragmentShader: frag,
    lights: true,
    fog: !!cfg.material?.fog,
  })

  return mat
}

function createStackedPlanesBufferGeometry(
  n: number,
  width: number,
  height: number,
  spacing: number,
  heightSegments: number,
): BufferGeometry {
  const geometry = new BufferGeometry()
  const numVertices = n * (heightSegments + 1) * 2
  const numFaces = n * heightSegments * 2
  const positions = new Float32Array(numVertices * 3)
  const indices = new Uint32Array(numFaces * 3)
  const uvs = new Float32Array(numVertices * 2)

  let vertexOffset = 0
  let indexOffset = 0
  let uvOffset = 0
  const totalWidth = n * width + (n - 1) * spacing
  const xOffsetBase = -totalWidth / 2

  for (let i = 0; i < n; i++) {
    const xOffset = xOffsetBase + i * (width + spacing)
    const uvXOffset = Math.random() * 300
    const uvYOffset = Math.random() * 300

    for (let j = 0; j <= heightSegments; j++) {
      const y = height * (j / heightSegments - 0.5)
      const v0 = [xOffset, y, 0]
      const v1 = [xOffset + width, y, 0]
      positions.set([...v0, ...v1], vertexOffset * 3)

      const uvY = j / heightSegments
      uvs.set([uvXOffset, uvY + uvYOffset, uvXOffset + 1, uvY + uvYOffset], uvOffset)

      if (j < heightSegments) {
        const a = vertexOffset
        const b = vertexOffset + 1
        const c = vertexOffset + 2
        const d = vertexOffset + 3
        indices.set([a, b, c, c, b, d], indexOffset)
        indexOffset += 6
      }
      vertexOffset += 2
      uvOffset += 4
    }
  }

  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('uv', new BufferAttribute(uvs, 2))
  geometry.setIndex(new BufferAttribute(indices, 1))
  geometry.computeVertexNormals()
  return geometry
}

const createBeamMaterial = () =>
  extendMaterial(MeshStandardMaterial, {
    header: `
  varying vec3 vEye;
  varying float vNoise;
  varying vec2 vUv;
  varying vec3 vPosition;
  uniform float time;
  uniform float uSpeed;
  uniform float uNoiseIntensity;
  uniform float uScale;
  ${noise}`,
    vertexHeader: `
  float getPos(vec3 pos) {
    vec3 noisePos =
      vec3(pos.x * 0., pos.y - uv.y, pos.z + time * uSpeed * 3.) * uScale;
    return cnoise(noisePos);
  }
  vec3 getCurrentPos(vec3 pos) {
    vec3 newpos = pos;
    newpos.z += getPos(pos);
    return newpos;
  }
  vec3 getNormal(vec3 pos) {
    vec3 curpos = getCurrentPos(pos);
    vec3 nextposX = getCurrentPos(pos + vec3(0.01, 0.0, 0.0));
    vec3 nextposZ = getCurrentPos(pos + vec3(0.0, -0.01, 0.0));
    vec3 tangentX = normalize(nextposX - curpos);
    vec3 tangentZ = normalize(nextposZ - curpos);
    return normalize(cross(tangentZ, tangentX));
  }`,
    fragmentHeader: '',
    vertex: {
      '#include <begin_vertex>': `transformed.z += getPos(transformed.xyz);`,
      '#include <beginnormal_vertex>': `objectNormal = getNormal(position.xyz);`,
    },
    fragment: {
      '#include <dithering_fragment>': `
    float randomNoise = noise(gl_FragCoord.xy);
    gl_FragColor.rgb -= randomNoise / 15. * uNoiseIntensity;`,
    },
    material: { fog: true },
    uniforms: {
      diffuse: new Color(...hexToNormalizedRGB('#000000')),
      time: { shared: true, mixed: true, linked: true, value: 0 },
      roughness: 0.3,
      metalness: 0.3,
      uSpeed: { shared: true, mixed: true, linked: true, value: props.speed },
      envMapIntensity: 10,
      uNoiseIntensity: props.noiseIntensity,
      uScale: props.scale,
    },
  })

const initThreeJS = () => {
  if (!containerRef.value) return

  const container = containerRef.value

  try {
    renderer = new WebGLRenderer({ antialias: true })
  }
  catch {
    // WebGL unavailable (disabled hardware acceleration, locked-down browser, some
    // crawlers). Leave the container empty and let the page's own bg color show through
    // rather than crashing the app.
    renderer = null
    return
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 1)

  scene = new Scene()

  camera = new PerspectiveCamera(30, 1, 0.1, 1000)
  camera.position.set(0, 0, 20)

  const geometry = createStackedPlanesBufferGeometry(props.beamNumber, props.beamWidth, props.beamHeight, 0, 24)

  const material = createBeamMaterial()
  beamMesh = new Mesh(geometry, material)

  const group = new Group()
  group.rotation.z = degToRad(props.rotation)
  group.add(beamMesh)
  scene.add(group)

  directionalLight = new DirectionalLight(new Color(props.lightColor), 1)
  directionalLight.position.set(0, 3, 10)
  const shadowCamera = directionalLight.shadow.camera as OrthographicCamera
  shadowCamera.top = 24
  shadowCamera.bottom = -24
  shadowCamera.left = -24
  shadowCamera.right = 24
  shadowCamera.far = 64
  directionalLight.shadow.bias = -0.004
  scene.add(directionalLight)

  ambientLight = new AmbientLight(0xffffff, 1)
  scene.add(ambientLight)

  renderer.domElement.addEventListener('webglcontextlost', onContextLost)
  renderer.domElement.addEventListener('webglcontextrestored', onContextRestored)
  container.appendChild(renderer.domElement)

  const resize = () => {
    if (!container || !renderer || !camera) return

    const width = container.offsetWidth
    const height = container.offsetHeight

    renderer.setSize(width, height)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  }

  resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(container)

  resize()

  let lastFrameTime = 0
  const animate = (timestamp: number) => {
    animationId = requestAnimationFrame(animate)
    if (!isVisible) return

    if (timestamp - lastFrameTime < 33) return
    lastFrameTime = timestamp

    if (beamMesh && beamMesh.material) {
      beamMesh.material.uniforms.time!.value += 0.1 * 0.033
    }

    if (renderer && scene && camera) {
      renderer.render(scene, camera)
      hasRendered.value = true
    }
  }

  animationId = requestAnimationFrame(animate)
}

// A lost WebGL context leaves the canvas empty: the OS reclaims GPU memory from a
// backgrounded tab, the GPU process crashes, or the browser drops its oldest context
// once too many are alive. three.js picks a restored context back up by itself; when
// the browser never restores it, start over with a fresh renderer.
const RESTORE_WAIT_MS = 1000
const MAX_REBUILDS = 3
let rebuilds = 0
let restoreTimer: ReturnType<typeof setTimeout> | undefined

function onContextLost() {
  hasRendered.value = false
  clearTimeout(restoreTimer)
  restoreTimer = setTimeout(rebuildIfLost, RESTORE_WAIT_MS)
}

function onContextRestored() {
  clearTimeout(restoreTimer)
}

function rebuildIfLost() {
  if (!renderer?.getContext().isContextLost()) return
  // A hidden page may lose the new context too; the visibility listener retries.
  if (document.hidden || rebuilds >= MAX_REBUILDS) return
  rebuilds++
  disposeRenderer()
  initThreeJS()
}

function onPageShown() {
  if (!document.hidden) rebuildIfLost()
}

function disposeRenderer() {
  resizeObserver?.disconnect()
  resizeObserver = null

  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }

  if (beamMesh) {
    beamMesh.geometry.dispose()
    beamMesh.material.dispose()
    beamMesh = null
  }

  if (renderer) {
    // dispose() alone leaves the GL context alive, and browsers cap live contexts.
    if (!renderer.getContext().isContextLost()) renderer.forceContextLoss()
    renderer.dispose()
    renderer.domElement.remove()
    renderer = null
  }

  scene = null
  camera = null
  directionalLight = null
  ambientLight = null
  hasRendered.value = false
}

const cleanup = () => {
  clearTimeout(startTimer)
  clearTimeout(restoreTimer)
  if (idleHandle !== undefined) cancelIdleCallback(idleHandle)

  observer?.disconnect()
  observer = null

  document.removeEventListener('visibilitychange', onPageShown)
  window.removeEventListener('pageshow', onPageShown)

  disposeRenderer()
}

onMounted(() => {
  document.addEventListener('visibilitychange', onPageShown)
  window.addEventListener('pageshow', onPageShown)

  if ('IntersectionObserver' in window && containerRef.value) {
    observer = new IntersectionObserver(([entry]) => {
      if (entry) isVisible = entry.isIntersecting
    })
    observer.observe(containerRef.value)
  }

  startTimer = setTimeout(() => {
    if ('requestIdleCallback' in window) {
      idleHandle = requestIdleCallback(() => initThreeJS(), { timeout: 500 })
    }
    else {
      initThreeJS()
    }
  }, 200)
})

onUnmounted(cleanup)
</script>

<style scoped>
.beams-container :deep(canvas) {
  opacity: 0;
  transition: opacity 800ms ease-out;
}

.beams-ready :deep(canvas) {
  opacity: 1;
}

/* Scene is rendered strictly grayscale (black diffuse, white lights, no hue),
   so a straight invert flips it to the light-theme equivalent for free. */
.beams-inverted {
  filter: invert(1);
}
</style>
