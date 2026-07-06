import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import { animate } from "animejs";

const FONT_URL = "/fonts/optimer_bold.typeface.json";

/** Read the site's --secondary accent (HSL triplet) into a THREE.Color. */
function accentColor() {
	const raw = getComputedStyle(document.documentElement)
		.getPropertyValue("--secondary")
		.trim(); // e.g. "240 100% 50%"
	const m = raw.match(/([\d.]+)\s+([\d.]+)%\s+([\d.]+)%/);
	const color = new THREE.Color();
	if (m) color.setHSL(+m[1] / 360, +m[2] / 100, +m[3] / 100);
	else color.set("#0000ff");
	return color;
}

/**
 * Vanilla three.js "MKS" wireframe that slowly rotates, tilts toward the
 * cursor, and is introduced with an anime.js settle. Kept deliberately light:
 * a single line-segment object, capped pixel ratio, rAF paused off-screen.
 */
export default function MksCanvas() {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		let raf = 0;
		let disposed = false;
		let visible = true;
		let width = canvas.clientWidth || 1;
		let height = canvas.clientHeight || 1;

		const renderer = new THREE.WebGLRenderer({
			canvas,
			alpha: true,
			antialias: true,
		});
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		renderer.setSize(width, height, false);

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
		camera.position.set(0, 0, 10.5);

		const group = new THREE.Group();
		scene.add(group);

		const material = new THREE.LineBasicMaterial({
			color: accentColor(),
			transparent: true,
			opacity: 0.9,
		});
		let lines = null;

		// Pointer-driven target tilt.
		const target = { x: 0, y: 0 };
		const current = { x: 0, y: 0 };
		// intro progress driven by anime.js (0 -> 1)
		const intro = { p: 0 };

		const loader = new FontLoader();
		loader.load(FONT_URL, (font) => {
			if (disposed) return;
			const geo = new TextGeometry("MKS", {
				font,
				size: 2.2,
				depth: 0.7,
				curveSegments: 6,
				bevelEnabled: true,
				bevelThickness: 0.06,
				bevelSize: 0.05,
				bevelSegments: 1,
			});
			geo.center();
			const edges = new THREE.EdgesGeometry(geo, 22);
			lines = new THREE.LineSegments(edges, material);
			group.add(lines);
			geo.dispose();

			// anime.js intro settle
			animate(intro, {
				p: 1,
				duration: 1600,
				ease: "outExpo",
			});
		});

		const onPointer = (e) => {
			const rect = canvas.getBoundingClientRect();
			const nx = (e.clientX - rect.left) / rect.width - 0.5;
			const ny = (e.clientY - rect.top) / rect.height - 0.5;
			target.x = ny * 0.5;
			target.y = nx * 0.9;
		};
		window.addEventListener("pointermove", onPointer, { passive: true });

		const resize = () => {
			width = canvas.clientWidth || 1;
			height = canvas.clientHeight || 1;
			renderer.setSize(width, height, false);
			camera.aspect = width / height;
			camera.updateProjectionMatrix();
		};
		const ro = new ResizeObserver(resize);
		ro.observe(canvas);

		// Pause rAF when the canvas scrolls out of view.
		const io = new IntersectionObserver(
			([entry]) => {
				visible = entry.isIntersecting;
				if (visible && !raf) loop();
			},
			{ threshold: 0.05 }
		);
		io.observe(canvas);

		// Keep the accent in sync with theme changes.
		const mo = new MutationObserver(() => material.color.copy(accentColor()));
		mo.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["data-theme"],
		});

		const clock = new THREE.Clock();

		function loop() {
			if (disposed) return;
			if (!visible || document.hidden) {
				raf = 0;
				return;
			}
			raf = requestAnimationFrame(loop);
			const t = clock.getElapsedTime();

			// ease the tilt toward the pointer target
			current.x += (target.x - current.x) * 0.05;
			current.y += (target.y - current.y) * 0.05;

			const p = intro.p;
			if (lines) {
				// Gentle front-facing sway keeps the "MKS" monogram legible
				// (a full spin would read mirrored half the time).
				group.rotation.x = current.x + Math.sin(t * 0.35) * 0.08;
				group.rotation.y = current.y + Math.sin(t * 0.3) * 0.5 + (1 - p) * -0.7;
				group.scale.setScalar(0.6 + 0.4 * p);
				material.opacity = 0.9 * p;
			}
			renderer.render(scene, camera);
		}
		loop();

		return () => {
			disposed = true;
			cancelAnimationFrame(raf);
			window.removeEventListener("pointermove", onPointer);
			ro.disconnect();
			io.disconnect();
			mo.disconnect();
			if (lines) {
				lines.geometry.dispose();
				group.remove(lines);
			}
			material.dispose();
			renderer.dispose();
		};
	}, []);

	return <canvas ref={canvasRef} className="mks-canvas" aria-hidden="true" />;
}
