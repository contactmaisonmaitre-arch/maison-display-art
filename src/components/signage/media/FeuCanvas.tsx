import { useEffect, useRef, useState } from "react";

/**
 * Feu de cheminée dessiné en direct (WebGL), sans aucune vidéo.
 *
 * Pourquoi : le navigateur du Fire TV Stick (Silk / Chrome 102) lit mal les
 * vidéos dans une page (écran noir, saccades, re-téléchargement de 15 Mo à
 * chaque passage). Ici rien à télécharger ni à décoder : un petit programme
 * dessine les flammes à basse résolution (480×270, agrandi par la TV, ce qui
 * adoucit naturellement le feu), à 30 images/s maximum.
 *
 * Si WebGL n'est pas disponible, on rend `fallback` (les braises en CSS).
 */

const VERT = `
attribute vec2 p;
void main(){ gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 r;
uniform float t;

float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h(i), h(i + vec2(1.0, 0.0)), f.x),
             mix(h(i + vec2(0.0, 1.0)), h(i + vec2(1.0, 1.0)), f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * n(p); p = p * 2.03 + vec2(1.7, 9.2); a *= 0.5; }
  return v;
}

float cap(vec2 p, vec2 a, vec2 b, float rad){
  vec2 pa = p - a, ba = b - a;
  float k = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * k) - rad;
}

void main(){
  vec2 uv = gl_FragCoord.xy / r;
  float asp = r.x / r.y;
  vec2 q = vec2((uv.x - 0.5) * asp, uv.y);

  // Flammes : une parabole déformée par une turbulence qui monte
  float y = q.y - 0.10;
  float spread = 0.50 + 0.04 * sin(t * 0.41);
  float nz = fbm(vec2(q.x * 4.6, y * 1.9 - t * 1.9));
  float nz2 = fbm(vec2(q.x * 9.0 + 3.0, y * 5.0 - t * 3.1));
  float xw = q.x + (nz - 0.5) * 0.30 * clamp(y * 2.0, 0.0, 1.0);
  float d = abs(xw) / spread;
  float tongue = n(vec2(q.x * 8.0, y * 1.1 - t * 2.4));
  float shape = 1.0 - d * d - y * 1.30 + (tongue - 0.5) * 0.55 * clamp(y * 3.0, 0.0, 1.0);
  float heat = shape + (nz - 0.5) * 1.10 + (nz2 - 0.5) * 0.45;
  heat = smoothstep(0.02, 0.95, heat) * step(0.0, y + 0.06);

  vec3 col = vec3(0.0);
  col = mix(col, vec3(0.30, 0.03, 0.02), smoothstep(0.00, 0.12, heat));
  col = mix(col, vec3(0.78, 0.16, 0.03), smoothstep(0.08, 0.35, heat));
  col = mix(col, vec3(0.98, 0.45, 0.08), smoothstep(0.30, 0.62, heat));
  col = mix(col, vec3(1.00, 0.76, 0.36), smoothstep(0.62, 0.92, heat));
  col = mix(col, vec3(1.00, 0.93, 0.74), smoothstep(0.92, 1.00, heat) * 0.6);

  // Lueur chaude sur le fond de l'âtre
  float halo = exp(-length(vec2(q.x * 1.1, (q.y - 0.25) * 1.4)) * 2.6);
  col += vec3(0.36, 0.08, 0.035) * halo * (0.8 + 0.2 * sin(t * 2.3 + nz * 4.0));

  // Bûches : trois rondins (deux devant, un derrière), braises dessous
  float lb = cap(q, vec2(-0.50, 0.135), vec2(0.46, 0.155), 0.045);
  float l1 = cap(q, vec2(-0.62, 0.055), vec2(0.06, 0.085), 0.050);
  float l2 = cap(q, vec2(-0.02, 0.080), vec2(0.64, 0.050), 0.050);
  float logs = 1.0 - smoothstep(-0.004, 0.004, min(lb, min(l1, l2)));
  float bark = 0.6 + 0.4 * n(vec2(q.x * 38.0, q.y * 7.0));
  vec3 wood = vec3(0.11, 0.045, 0.025) * bark;
  // bord supérieur éclairé par le feu
  float rim = smoothstep(0.03, 0.0, abs(min(l1, l2) + 0.012)) * step(0.06, q.y) ;
  wood += vec3(0.55, 0.16, 0.04) * rim * (0.6 + 0.4 * n(vec2(q.x * 20.0, t)));
  col = mix(col, wood, logs);

  float ember = smoothstep(0.07, 0.0, abs(q.y - 0.02)) * (1.0 - smoothstep(0.35, 0.68, abs(q.x)));
  float glow = 0.5 + 0.5 * n(vec2(q.x * 14.0, t * 1.1));
  col += vec3(1.0, 0.36, 0.06) * ember * glow * (1.0 - logs);

  // Étincelles qui montent
  vec2 sp = vec2(q.x * 26.0, q.y * 9.0 - t * 2.6);
  vec2 cell = floor(sp);
  float rnd = h(cell);
  vec2 f = fract(sp) - vec2(0.5 + 0.3 * sin(t + rnd * 6.0), 0.5);
  float spark = step(0.97, rnd) * smoothstep(0.10, 0.0, length(f)) * smoothstep(0.9, 0.3, q.y) * step(0.25, q.y);
  col += vec3(1.0, 0.66, 0.28) * spark * (1.0 - smoothstep(0.3, 0.6, abs(q.x)));

  // Vignette
  float v = smoothstep(1.2, 0.3, length(vec2((uv.x - 0.5) * 1.35, uv.y - 0.33)));
  col *= 0.30 + 0.70 * v;

  gl_FragColor = vec4(col, 1.0);
}
`;

const compile = (gl: WebGLRenderingContext, type: number, src: string) => {
  const s = gl.createShader(type);
  if (!s) return null;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s);
    return null;
  }
  return s;
};

export const FeuCanvas = ({ fallback }: { fallback?: React.ReactNode }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    let gl: WebGLRenderingContext | null = null;
    try {
      gl = (c.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" }) ||
        c.getContext("experimental-webgl")) as WebGLRenderingContext | null;
    } catch {
      gl = null;
    }
    if (!gl) {
      setFailed(true);
      return;
    }
    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) {
      setFailed(true);
      return;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      setFailed(true);
      return;
    }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prog, "r");
    const uT = gl.getUniformLocation(prog, "t");
    gl.viewport(0, 0, c.width, c.height);
    gl.uniform2f(uR, c.width, c.height);

    // Temps figé possible pour les aperçus : ?feu-t=12.5
    const frozen = Number(new URLSearchParams(window.location.search).get("feu-t"));
    const start = performance.now() - Math.random() * 20000;
    let raf = 0;
    let last = 0;
    const draw = (now: number) => {
      raf = requestAnimationFrame(draw);
      if (now - last < 33) return; // ~30 i/s : largement assez pour un feu, et doux pour le Fire Stick
      last = now;
      gl!.uniform1f(uT, frozen > 0 ? frozen : (now - start) / 1000);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
    };
    raf = requestAnimationFrame(draw);

    const onLost = (e: Event) => {
      e.preventDefault();
      cancelAnimationFrame(raf);
      setFailed(true);
    };
    c.addEventListener("webglcontextlost", onLost);
    return () => {
      cancelAnimationFrame(raf);
      c.removeEventListener("webglcontextlost", onLost);
      // Libère le contexte : la TV n'en garde pas un par passage du feu.
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  if (failed) return <>{fallback}</>;
  return (
    <canvas
      ref={ref}
      width={480}
      height={270}
      className="absolute inset-0 h-full w-full"
      style={{ imageRendering: "auto" }}
      aria-hidden
    />
  );
};
