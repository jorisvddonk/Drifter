import {
  LitElement,
  html,
  css
} from 'https://cdn.jsdelivr.net/gh/lit/dist@3/core/lit-core.min.js';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { generatePlanetTexture } from './noctis-iv-all.js';

export class NoctisPlanet extends LitElement {
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
    this.type = 1;
    this.seed = 12345;
    this.size = 200;
    this.speed = 0.005;
    this._scene = null;
    this._camera = null;
    this._renderer = null;
    this._sphere = null;
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

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    this._scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 3, 5);
    this._scene.add(directionalLight);

    this._updateTexture();
  }

  _updateTexture() {
    if (!this._sphere) return;

    const canvas = generatePlanetTexture(this.type, this.seed);
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

customElements.define('noctis-planet', NoctisPlanet);
