"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ReactiveGrid({
	width = 30,
	height = 30,
	rows = 25,
	columns = 25,
	pointSize = 0.1,
}) {
	const mountRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const div = mountRef.current;
		if (!div) return;
		const W = div.clientWidth;
		const H = div.clientHeight;

		const renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(W, H);
		renderer.setClearColor(0x000000);

		div.appendChild(renderer.domElement);

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(55, W / H);
		camera.position.set(width / 2, height * 0.25, (width + height) / 2);
		camera.lookAt(width / 2, height / 2, 0);

		const geometry = new THREE.SphereGeometry(pointSize, 16, 16);
		const material = new THREE.MeshBasicMaterial();
		const mesh = new THREE.InstancedMesh(geometry, material, columns * rows);
		scene.add(mesh);

		const matrix = new THREE.Matrix4();
		const color = new THREE.Color();

		let animId: number;
		const start = performance.now();

		const distance = function(
			x1: number,
			y1: number,
			z1: number,
			x2: number,
			y2: number,
			z2: number,
		) {
			return Math.sqrt(
				Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2) + Math.pow(z1 - z2, 2),
			);
		};

		const animate = function() {
			animId = requestAnimationFrame(animate);
			const t = (performance.now() - start) / 1000;
			for (let r = 0; r < rows; r++) {
				for (let c = 0; c < columns; c++) {
					const idx = r * columns + c;
					const x = (c / columns) * width;
					const y = (r / rows) * height;
					const z = Math.sin(x * 0.5 + t);

					// Calculate lightness based on distance to center
					let l =
						1 -
						distance(x, y, z, width / 2, height / 2, 0) /
						(Math.max(height, width) / 2);

					matrix.setPosition(x, y, z);
					mesh.setMatrixAt(idx, matrix);
					color.setHSL(1, 1, l / 2);
					mesh.setColorAt(idx, color);
				}
			}
			if (!mesh.instanceColor) return;
			mesh.instanceMatrix.needsUpdate = true;
			mesh.instanceColor.needsUpdate = true;

			renderer.render(scene, camera);

			const onResize = () => {
				const w = div.clientWidth;
				const h = div.clientHeight;
				camera.aspect = w / h;
				camera.updateProjectionMatrix();
				renderer.setSize(w, h);
			};
			window.addEventListener("resize", onResize);

			// Clean up the component
			return () => {
				cancelAnimationFrame(animId);
				window.removeEventListener("resize", onResize);
				renderer.dispose();
				geometry.dispose();
				material.dispose();
				div.removeChild(renderer.domElement);
			};
		};

		animate();
	}, []);

	return <div ref={mountRef} className="w-full h-full" />;
}
