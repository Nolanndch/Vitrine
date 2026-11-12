/* TAKUZO — Sculptures en chrome liquide (WebGL, sans dépendance).
   Un seul shader en raymarching ; trois formes : blob (accueil), ring (contact), twist (services).
   <canvas data-chrome="blob" data-tint-a="cyan" data-tint-b="violet"> dans un .chrome-stage.
   Pause hors écran / onglet caché, image fixe si prefers-reduced-motion, résolution adaptative. */
(function () {
  'use strict';
  var canvases = document.querySelectorAll('canvas[data-chrome]');
  if (!canvases.length) return;

  var TINTS = {
    cyan: [0.33, 0.89, 0.88], violet: [0.65, 0.55, 0.98],
    orange: [1.0, 0.4, 0.24], lime: [0.78, 0.93, 0.41], silver: [0.85, 0.88, 0.92]
  };
  var VARIANTS = { blob: 0, ring: 1, twist: 2 };
  var START = { blob: 9.0, ring: 3.0, twist: 5.0 };

  var VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
  var FRAG = [
    'precision highp float;',
    'uniform vec2 uRes;uniform float uTime;uniform vec2 uMouse;uniform float uVariant;uniform vec3 uTintA;uniform vec3 uTintB;',
    'mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}',
    'float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}',
    'float box2(vec2 p,vec2 b,float r){vec2 d=abs(p)-b+r;return length(max(d,0.))+min(max(d.x,d.y),0.)-r;}',
    'float box3(vec3 p,vec3 b,float r){vec3 d=abs(p)-b+r;return length(max(d,0.))+min(max(d.x,max(d.y,d.z)),0.)-r;}',
    'float map(vec3 p){',
    '  float t=uTime;',
    '  p.yz*=rot(uMouse.y*.22);p.xz*=rot(uMouse.x*.38);',
    '  if(uVariant<.5){',
    '    p.xz*=rot(t*.06);p.xy*=rot(.35);',
    '    float d=length(p*vec3(1.,1.15,1.1))-.72;',
    '    vec3 c1=vec3(sin(t*.31)*.95,cos(t*.23)*.35,sin(t*.19)*.45);',
    '    vec3 c2=vec3(cos(t*.27+2.)*.9,sin(t*.35+1.)*.55,cos(t*.21)*.5);',
    '    vec3 c3=vec3(sin(t*.17+4.)*.7,cos(t*.29+3.)*.45,sin(t*.25+2.)*.45);',
    '    d=smin(d,length(p-c1)-.56,.55);d=smin(d,length(p-c2)-.48,.5);d=smin(d,length(p-c3)-.4,.45);',
    '    d+=.04*sin(3.1*p.x+t*.6)*sin(2.7*p.y+t*.45)*sin(2.9*p.z-t*.5);',
    '    return d*.85;',
    '  } else if(uVariant<1.5){',
    '    p.yz*=rot(1.05+sin(t*.21)*.12);p.xy*=rot(t*.05);',
    '    float a=atan(p.y,p.x);',
    '    vec2 q=vec2(length(p.xy)-1.12,p.z);',
    '    q*=rot(a*1.5+t*.35);',
    '    float d=box2(q,vec2(.4,.1),.08);',
    '    d+=.03*sin(a*4.+t*.6);',
    '    return d*.6;',
    '  }',
    '  p.xy*=rot(-.5);p.xz*=rot(t*.08);',
    '  vec3 q=p;q.xz*=rot(q.y*1.35+sin(t*.3)*.6);',
    '  float d=box3(q,vec3(.55,1.25,.16),.14);',
    '  d+=.035*sin(q.y*4.+t*.7);',
    '  return d*.55;',
    '}',
    'vec3 nrm(vec3 p){const vec2 k=vec2(1.,-1.);const float h=.0015;',
    '  return normalize(k.xyy*map(p+k.xyy*h)+k.yyx*map(p+k.yyx*h)+k.yxy*map(p+k.yxy*h)+k.xxx*map(p+k.xxx*h));}',
    /* Studio virtuel : fond nuit, ligne d'horizon nette, boîte à lumière, barres lumineuses, panneaux teintés aux bords */
    'float band(float x,float w,float s){return 1.-smoothstep(w,w+s,abs(x));}',
    'vec3 env(vec3 r){',
    '  r.xz*=rot(uTime*.03+uMouse.x*.25);',
    '  float y=r.y;float az=atan(r.x,r.z);',
    '  vec3 sky=mix(vec3(.05,.06,.09),vec3(.78,.82,.9),pow(smoothstep(-.02,1.,y),.6));',
    '  vec3 gnd=vec3(.05,.06,.085)+uTintB*.05*smoothstep(0.,.8,-y);',
    '  vec3 c=mix(gnd,sky,smoothstep(-.06,.0,y));',
    '  c*=1.-.75*band(az-.2,.06,.14)*smoothstep(.05,.3,y);',
    '  c*=1.-.6*band(az+1.15,.05,.1)*smoothstep(.0,.25,y);',
    '  float hz=y+.03;',
    '  c+=vec3(.95,.97,1.)*band(hz,.005,.012)*1.5+vec3(.4,.45,.55)*band(hz,.0,.18)*.3;',
    '  c+=vec3(1.)*band(az+.62,.28,.16)*band(y-.72,.14,.12)*2.2;',
    '  c+=vec3(1.)*band(az-.62,.02,.02)*band(y-.35,.42,.1)*1.6;',
    '  c+=vec3(1.)*band(az-.95,.12,.1)*band(y-.82,.06,.08)*1.3;',
    '  c+=uTintA*band(az-1.35,.26,.3)*band(y-.1,.38,.28)*1.7;',
    '  c+=uTintB*band(az+1.65,.24,.3)*band(y+.05,.34,.28)*1.5;',
    '  c+=mix(uTintA,uTintB,.5)*.14*smoothstep(.4,1.,-cos(az))*smoothstep(.4,-.4,y);',
    '  return c;',
    '}',
    'void main(){',
    '  float m=min(uRes.x,uRes.y);',
    '  vec2 uv=(gl_FragCoord.xy*2.-uRes)/m;',
    '  vec3 ro=vec3(0.,0.,4.2);vec3 rd=normalize(vec3(uv,-2.));',
    '  float R=uVariant<.5?2.05:(uVariant<1.5?1.75:1.6);',
    '  float b=dot(ro,rd);float h=b*b-dot(ro,ro)+R*R;',
    '  if(h<0.){gl_FragColor=vec4(0.);return;}',
    '  h=sqrt(h);float t=-b-h;float tEnd=-b+h;',
    '  float minD=1e3;float tMin=t;bool hit=false;',
    '  for(int i=0;i<STEPS;i++){',
    '    float d=map(ro+rd*t);',
    '    if(d<minD){minD=d;tMin=t;}',
    '    if(d<.0012*t){hit=true;break;}',
    '    t+=d;if(t>tEnd)break;',
    '  }',
    '  float pf=t*2./(m*2.);',
    '  float al=hit?1.:1.-smoothstep(0.,pf*1.6,minD);',
    '  if(al<=0.){gl_FragColor=vec4(0.);return;}',
    '  vec3 p=ro+rd*(hit?t:tMin);',
    '  vec3 n=nrm(p);vec3 r=reflect(rd,n);',
    '  float ndv=clamp(dot(n,-rd),0.,1.);',
    '  float fr=pow(1.-ndv,4.);',
    '  vec3 col=env(r)*mix(vec3(.9,.92,.95),vec3(1.),fr);',
    '  vec3 ir=.5+.5*cos(6.2831*(ndv*1.6+vec3(0.,.33,.67))+uTime*.06);',
    '  col+=col*(ir-.5)*.35*fr;',
    '  col*=.7+.3*clamp(map(p+n*.14)/.12,0.,1.);',
    '  col=1.-exp(-col*1.9);',
    '  gl_FragColor=vec4(col*al,al);',
    '}'
  ].join('\n');

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var fine = window.matchMedia('(pointer: fine)').matches;
  var mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  if (fine) {
    window.addEventListener('pointermove', function (e) {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });
  }

  // Le shader ne démarre qu'après le chargement, quand le navigateur est inactif : le premier rendu passe avant le GPU.
  // Économie de données : on garde le poster CSS, sans shader.
  var saveData = navigator.connection && navigator.connection.saveData;
  if (!saveData) {
    var start = function () { Array.prototype.forEach.call(canvases, init); };
    var idle = function (cb) {
      if (window.requestIdleCallback) window.requestIdleCallback(cb, { timeout: 1500 });
      else setTimeout(cb, 200);
    };
    if (document.readyState === 'complete') idle(start);
    else window.addEventListener('load', function () { idle(start); });
  }

  function init(cv) {
    var stage = cv.parentElement;
    var gl = cv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, powerPreference: 'high-performance' });
    if (!gl) { stage.classList.add('is-fallback'); return; }
    var steps = fine ? 88 : 64;
    var prog = program(gl, VERT, '#define STEPS ' + steps + '\n' + FRAG);
    if (!prog) { stage.classList.add('is-fallback'); return; }

    var name = cv.dataset.chrome in VARIANTS ? cv.dataset.chrome : 'blob';
    gl.useProgram(prog);
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'a');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    var u = {};
    ['uRes', 'uTime', 'uMouse', 'uVariant', 'uTintA', 'uTintB'].forEach(function (k) { u[k] = gl.getUniformLocation(prog, k); });
    gl.uniform1f(u.uVariant, VARIANTS[name]);
    gl.uniform3fv(u.uTintA, TINTS[cv.dataset.tintA] || TINTS.cyan);
    gl.uniform3fv(u.uTintB, TINTS[cv.dataset.tintB] || TINTS.violet);

    var quality = 1, budget = fine ? 1.6e6 : 0.7e6;
    var visible = true, running = false, raf = 0, time = START[name], last = 0, ready = false;
    var frames = 0, acc = 0;

    function resize() {
      var w = cv.clientWidth, h = cv.clientHeight;
      if (!w || !h) return;
      var scale = Math.min(window.devicePixelRatio || 1, fine ? 1.75 : 1.5, Math.sqrt(budget / (w * h))) * quality;
      cv.width = Math.max(1, Math.round(w * scale));
      cv.height = Math.max(1, Math.round(h * scale));
      gl.viewport(0, 0, cv.width, cv.height);
      gl.uniform2f(u.uRes, cv.width, cv.height);
      if (!running) draw();
    }
    function draw() {
      gl.uniform1f(u.uTime, time);
      gl.uniform2f(u.uMouse, mouse.x, mouse.y);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (!ready) { ready = true; cv.classList.add('is-ready'); stage.classList.add('is-live'); }
    }
    function frame(now) {
      raf = requestAnimationFrame(frame);
      var dt = last ? Math.min(now - last, 100) : 16;
      last = now;
      time += dt / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      draw();
      // Résolution adaptative : si l'appareil peine, on réduit la définition (jamais sous 50 %)
      if (quality > 0.5) {
        acc += dt; frames++;
        if (frames === 45) {
          if (acc / frames > 24) { quality = Math.max(0.5, quality * 0.78); resize(); }
          frames = 0; acc = 0;
        }
      }
    }
    function update() {
      var should = visible && !document.hidden && !reduce.matches;
      if (should && !running) { running = true; last = 0; raf = requestAnimationFrame(frame); }
      else if (!should && running) { running = false; cancelAnimationFrame(raf); }
      if (!running) draw();
    }

    if ('ResizeObserver' in window) new ResizeObserver(resize).observe(cv); else window.addEventListener('resize', resize);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { visible = e[0].isIntersecting; update(); }, { rootMargin: '100px' }).observe(cv);
    }
    document.addEventListener('visibilitychange', update);
    if (reduce.addEventListener) reduce.addEventListener('change', update);
    cv.addEventListener('webglcontextlost', function (e) { e.preventDefault(); running = false; cancelAnimationFrame(raf); });
    resize();
    update();
  }

  function program(gl, vs, fs) {
    function sh(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
      return s;
    }
    var v = sh(gl.VERTEX_SHADER, vs), f = sh(gl.FRAGMENT_SHADER, fs);
    if (!v || !f) return null;
    var p = gl.createProgram();
    gl.attachShader(p, v); gl.attachShader(p, f); gl.linkProgram(p);
    return gl.getProgramParameter(p, gl.LINK_STATUS) ? p : null;
  }
})();
