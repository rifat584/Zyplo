"use client";

import { useEffect, useMemo, useRef } from "react";
import { Color, Mesh, Program, Renderer, Triangle } from "ogl";

const MAX_COLOR_STOPS = 12;

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

#define MAX_COLOR_STOPS 12

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[MAX_COLOR_STOPS];
uniform int uColorCount;
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ),
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

vec3 sampleColor(float factor) {
  int count = max(uColorCount, 1);
  if (count == 1) {
    return uColorStops[0];
  }

  float scaled = clamp(factor, 0.0, 1.0) * float(count - 1);
  int i0 = int(floor(scaled));
  int i1 = min(i0 + 1, count - 1);
  float t = fract(scaled);
  return mix(uColorStops[i0], uColorStops[i1], t);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec3 rampColor = sampleColor(uv.x);

  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;

  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);

  vec3 auroraColor = intensity * rampColor;
  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`;

function hexToRgb(hex) {
  const c = new Color(hex);
  return [c.r, c.g, c.b];
}

function lerpColor(a, b, t) {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

function normalizeColors(inputColors) {
  const source = inputColors.map(hexToRgb);
  if (source.length <= MAX_COLOR_STOPS) {
    return source;
  }

  const normalized = [];
  for (let i = 0; i < MAX_COLOR_STOPS; i += 1) {
    const t = i / (MAX_COLOR_STOPS - 1);
    const scaled = t * (source.length - 1);
    const low = Math.floor(scaled);
    const high = Math.min(low + 1, source.length - 1);
    normalized.push(lerpColor(source[low], source[high], scaled - low));
  }
  return normalized;
}

function buildUniformColorArray(inputColors) {
  const normalized = normalizeColors(inputColors);
  const fallback = normalized[0] ?? [0.39, 0.4, 0.95];
  const padded = Array.from({ length: MAX_COLOR_STOPS }, (_, i) => normalized[i] ?? fallback);

  return {
    colors: padded,
    count: Math.max(1, Math.min(normalized.length, MAX_COLOR_STOPS)),
  };
}

export default function Aurora(props) {
  const {
    enabled = true,
    speed = 1.0,
    intensity,
    amplitude,
    blend = 0.5,
    colors,
    colorStops,
    time,
  } = props;

  const safeIntensity = intensity ?? amplitude ?? 1.0;
  const safeColors = useMemo(() => {
    if (colors?.length) return colors;
    if (colorStops?.length) return colorStops;
    return ["#6366f1", "#22d3ee"];
  }, [colors, colorStops]);

  const colorsKey = useMemo(() => {
    return (safeColors || []).join(",");
  }, [safeColors]);
  const uniformColors = useMemo(() => buildUniformColorArray(safeColors), [safeColors]);

  const ctnDom = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const ctn = ctnDom.current;
    if (!ctn) return;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = "transparent";

    let program;

    function resize() {
      if (!ctn) return;
      const width = ctn.offsetWidth;
      const height = ctn.offsetHeight;
      renderer.setSize(width, height);
      if (program) {
        program.uniforms.uResolution.value = [width, height];
      }
    }

    window.addEventListener("resize", resize);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) {
      delete geometry.attributes.uv;
    }

    program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: safeIntensity },
        uColorStops: { value: uniformColors.colors },
        uColorCount: { value: uniformColors.count },
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uBlend: { value: blend },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    let animateId = 0;
    const update = (t) => {
      animateId = requestAnimationFrame(update);
      if (!program) {
        return;
      }

      program.uniforms.uTime.value = (time ?? t * 0.01) * speed * 0.1;
      program.uniforms.uAmplitude.value = safeIntensity;
      program.uniforms.uBlend.value = blend;
      program.uniforms.uColorStops.value = uniformColors.colors;
      program.uniforms.uColorCount.value = uniformColors.count;

      renderer.render({ scene: mesh });
    };

    animateId = requestAnimationFrame(update);
    resize();

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener("resize", resize);
      if (ctn && gl.canvas.parentNode === ctn) {
        ctn.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [enabled, speed, safeIntensity, blend, colorsKey, uniformColors, time]);

  return <div ref={ctnDom} className="h-full w-full" />;
}
