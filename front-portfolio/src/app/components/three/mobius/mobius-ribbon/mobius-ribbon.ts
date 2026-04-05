import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  viewChild,
} from '@angular/core';
import { beforeRender } from 'angular-three';
import * as THREE from 'three';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
import * as ParametricFunctions from 'three/addons/geometries/ParametricFunctions.js';

@Component({
  selector: 'app-mobius-ribbon',
  standalone: true,
  templateUrl: './mobius-ribbon.html',
  styleUrl: './mobius-ribbon.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobiusRibbon {
  private readonly meshRef = viewChild.required<ElementRef<THREE.Mesh>>('mesh');
  private time = 0;

  protected readonly geometry = new ParametricGeometry(
    ParametricFunctions.mobius3d,
    220,
    48
  );

  protected readonly material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#2a163a'),
    emissive: new THREE.Color('#3b1b5a'),
    emissiveIntensity: 0.18,

    metalness: 0.08,
    roughness: 0.18,

    clearcoat: 1,
    clearcoatRoughness: 0.08,

    iridescence: 0.65,
    iridescenceIOR: 1.22,
    iridescenceThicknessRange: [180, 320],

    reflectivity: 0.55,

    side: THREE.DoubleSide,
  });

  constructor() {
    this.geometry.computeVertexNormals();

    beforeRender(({ delta }) => {
      const mesh = this.meshRef().nativeElement;

      this.time += delta;

      mesh.rotation.y += delta * 0.22;
      mesh.rotation.x = 0.55 + Math.sin(this.time * 0.8) * 0.035;
      mesh.rotation.z = Math.sin(this.time * 0.45) * 0.04;

      this.material.emissiveIntensity = 0.16 + (Math.sin(this.time * 1.4) + 1) * 0.03;

      this.material.iridescenceThicknessRange = [
        180 + Math.sin(this.time * 0.7) * 10,
        320 + Math.cos(this.time * 0.6) * 12,
      ];
    });
  }
}
