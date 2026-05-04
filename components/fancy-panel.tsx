"use client";

import styles from "../styles/fancy-panel.module.css";

export default function FancyPanel({
	maxTilt = 12,
	glowColor = "white",
	className = "",
	children,
	...props
}: {
	maxTilt?: number;
	glowColor?: string;
	className?: string;
	children: React.ReactNode;
}) {
	const handleMouseMove = (e: any) => {
		const el = e.currentTarget;
		const r = el.getBoundingClientRect();
		const x = e.clientX - r.left;
		const y = e.clientY - r.top;
		const nx = (x / r.width - 0.5) * 2;
		const ny = (y / r.height - 0.5) * 2;
		el.style.setProperty("--x", x);
		el.style.setProperty("--y", y);
		el.style.setProperty("--rx", ny * maxTilt);
		el.style.setProperty("--ry", nx * maxTilt);
	};

	const handleMouseLeave = (e: any) => {
		const el = e.currentTarget;
		el.style.setProperty("--x", -Infinity);
		el.style.setProperty("--y", -Infinity);
		el.style.setProperty("--rx", 0);
		el.style.setProperty("--ry", 0);
	};

	return (
		<div
			{...props}
			className={`${styles.panel} ${className}`}
			style={{ "--glow-color": glowColor } as React.CSSProperties}
			onMouseMove={handleMouseMove}
			onMouseLeave={handleMouseLeave}
		>
			{children}
		</div>
	);
}
