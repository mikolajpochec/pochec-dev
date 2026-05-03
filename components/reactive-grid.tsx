"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ReactiveGrid({
	width = 30,
	height = 30,
	rows = 40,
	columns = 40,
	pointSize = 0.1,
	cursorRepelForce = 1,
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

		// Raycasting to plane logic
		const raycaster = new THREE.Raycaster();
		const mouse = new THREE.Vector2();
		const groundPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
		const hitPoint = new THREE.Vector3();
		let hasHit = false;

		const onMouseMove = (e: MouseEvent) => {
			const rect = div.getBoundingClientRect();
			mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
			mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
			raycaster.setFromCamera(mouse, camera);
			hasHit = !!raycaster.ray.intersectPlane(groundPlane, hitPoint);
		};
		div.addEventListener("mousemove", onMouseMove);

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
					let x = (c / columns) * width;
					let y = (r / rows) * height;
					const distToCursor = Math.sqrt(
						distance(x, y, 0, hitPoint.x, hitPoint.y, hitPoint.z),
					);
					let z = Math.sin(x * 0.5 + t) + distToCursor;

					// Repelling force
					let dirX = x - hitPoint.x;
					let dirY = y - hitPoint.y;
					x += dirX * cursorRepelForce * Math.pow(10, -distToCursor / 2);
					y += dirY * cursorRepelForce * Math.pow(10, -distToCursor / 2);

					// Calculate lightness based on distance to center
					let distanceToCenter = distance(x, y, z, width / 2, height / 2, 0);
					let norm = Math.min(height, width) / 2;
					let l = 1 - distanceToCenter / norm;

					matrix.setPosition(x, y, z);
					mesh.setMatrixAt(idx, matrix);
					color.setHSL(Math.sin(t / 10), 1, l / 2);
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
				div.removeEventListener("mousemove", onMouseMove);
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
