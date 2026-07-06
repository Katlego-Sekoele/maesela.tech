import { lazy, Suspense, useEffect, useState } from "react";
import MksFallback from "./MksFallback";
import "./styles.css";

// three.js + anime.js live behind this boundary so they only load when the
// interactive canvas is actually rendered (never on reduced-motion / mobile).
const MksCanvas = lazy(() => import("./MksCanvas"));

const QUERY = "(prefers-reduced-motion: reduce), (max-width: 48rem)";

/**
 * Editorial hero object: an interactive 3D "MKS" monogram, with a static SVG
 * fallback for users who prefer reduced motion or are on small screens.
 */
export default function MksObject() {
	const [useStatic, setUseStatic] = useState(true);

	useEffect(() => {
		const mql = window.matchMedia(QUERY);
		const update = () => setUseStatic(mql.matches);
		update();
		mql.addEventListener("change", update);
		return () => mql.removeEventListener("change", update);
	}, []);

	return (
		<div className="mks-object">
			{useStatic ? (
				<MksFallback />
			) : (
				<Suspense fallback={<MksFallback />}>
					<MksCanvas />
				</Suspense>
			)}
		</div>
	);
}
