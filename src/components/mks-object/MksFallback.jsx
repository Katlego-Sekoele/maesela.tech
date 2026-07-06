/** Static, dependency-free "MKS" mark used when motion/3D is not wanted. */
export default function MksFallback() {
	return (
		<svg
			className="mks-fallback"
			viewBox="0 0 300 120"
			role="img"
			aria-label="MKS monogram"
		>
			<text
				x="50%"
				y="50%"
				dominantBaseline="central"
				textAnchor="middle"
				fill="none"
				stroke="hsl(var(--secondary))"
				strokeWidth="1.5"
				fontFamily="var(--font-serif)"
				fontWeight="600"
				fontSize="86"
				letterSpacing="4"
			>
				MKS
			</text>
		</svg>
	);
}
