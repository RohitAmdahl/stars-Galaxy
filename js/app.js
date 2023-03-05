// import './style.css'
import * as THREE from "https://cdn.skypack.dev/three@0.132.2";

import { OrbitControls } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/controls/OrbitControls.js";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

//galaxy
const starParameters = {};
starParameters.count = 1000;
starParameters.size = 0.01;
starParameters.radius = 1.15;
starParameters.branches = 3;
starParameters.spin = 50;
starParameters.randomness = 5;
starParameters.randomnessPower = 10;
starParameters.insideColor = "#8C5D7A";
starParameters.outsideColor = "#808CC2";

let material = null;
let geometry = null;
let points = null;

const Galaxy = () => {
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  material = new THREE.PointsMaterial({
    size: starParameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  //
  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(starParameters.count * 3);

  const colors = new Float32Array(starParameters.count * 3);
  const colorInside = new THREE.Color(starParameters.insideColor);
  const colorOutside = new THREE.Color(starParameters.outsideColor);

  for (let i = 0; i < starParameters.count; i++) {
    const i3 = i * 3;
    const radius = Math.pow(
      Math.random() * starParameters.randomness,
      Math.random() * starParameters.radius
    );
    const spinAngle = radius * starParameters.spin;
    const branchAngle =
      ((i % starParameters.branches) / starParameters.branches) * Math.PI * 2;

    const negPos = [1, -1];
    const randomX =
      Math.pow(Math.random(), starParameters.randomnessPower) *
      negPos[Math.floor(Math.random() * negPos.length)];
    const randomY =
      Math.pow(Math.random(), starParameters.randomnessPower) *
      negPos[Math.floor(Math.random() * negPos.length)];
    const randomZ =
      Math.pow(Math.random(), starParameters.randomnessPower) *
      negPos[Math.floor(Math.random() * negPos.length)];

    positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    const mixedColor = colorInside.clone();
    mixedColor.lerp(
      colorOutside,
      (Math.random() * radius) / starParameters.radius
    );

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  points = new THREE.Points(geometry, material);
  scene.add(points);
  const SunGeometry = new THREE.SphereGeometry(0.1, 32, 16);
  const SunMaterial = new THREE.MeshBasicMaterial({
    color: "#fcb500",
  });

  const sphere = new THREE.Mesh(SunGeometry, SunMaterial);
  scene.add(sphere);

  //-----------
};
Galaxy();

/**
 * Test cube
 */

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.3,
  100
);
camera.position.x = 0;
camera.position.y = 1;
camera.position.z = 0;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 10));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  camera.position.x = Math.cos(elapsedTime * 0.04);
  camera.position.z = Math.sin(elapsedTime * 0.05);
  camera.lookAt(0, 0, 0);

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
