import {
  LitElement,
  html,
  css
} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { generateStarTexture, star_class_colors } from './noctis-iv-all.js';

export class NoctisStar extends LitElement {
  static properties = {
    type: { type: Number },
    seed: { type: Number },
    size: { type: Number },
    speed: { type: Number }
  };

  static styles = css`
    :host {
      display: inline-block;
    }
    canvas {
      display: block;
    }
  `;

  constructor() {
    super();
    this.type = 4;
    this.seed = 12345;
    this.size = 200;
    this.speed = 0.002;
    this._scene = null;
    this._camera = null;
    this._renderer = null;
    this._sphere = null;
    this._halo = null;
    this._animationId = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._initThree();
    this._animate();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._animationId) {
      cancelAnimationFrame(this._animationId);
    }
    if (this._renderer) {
      this._renderer.dispose();
    }
  }

  updated(changedProperties) {
    if (changedProperties.has('type') || changedProperties.has('seed')) {
      this._updateTexture();
      this._updateHalo();
    }
  }

  _initThree() {
    const width = this.size;
    const height = this.size;

    this._scene = new THREE.Scene();
    this._camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this._camera.position.z = 3;

    this._renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this._renderer.setSize(width, height);
    this.shadowRoot.appendChild(this._renderer.domElement);

    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshBasicMaterial();
    this._sphere = new THREE.Mesh(geometry, material);
    this._scene.add(this._sphere);

    this._createHalo();

    this._updateTexture();
  }

  _createHalo() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(0.2, 'rgba(255, 255, 255, 0.4)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 256, 256);

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this._halo = new THREE.Sprite(material);
    this._halo.scale.set(3.5, 3.5, 1);
    this._scene.add(this._halo);
  }

  _updateHalo() {
    if (!this._halo) return;

    const colors = star_class_colors[this.type];
    const r = colors[0] / 63;
    const g = colors[1] / 63;
    const b = colors[2] / 63;

    this._halo.material.color.setRGB(r, g, b);
  }

  _updateTexture() {
    if (!this._sphere) return;

    const canvas = generateStarTexture(this.type, this.seed);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    this._sphere.material.map = texture;
    this._sphere.material.needsUpdate = true;
  }

  _animate = () => {
    if (this._sphere) {
      this._sphere.rotation.y += this.speed;
    }
    if (this._renderer && this._scene && this._camera) {
      this._renderer.render(this._scene, this._camera);
    }
    this._animationId = requestAnimationFrame(this._animate);
  };

  render() {
    return html``;
  }
}

customElements.define('noctis-star', NoctisStar);
