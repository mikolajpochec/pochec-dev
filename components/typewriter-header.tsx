"use client";
import { useEffect, useState } from "react";
import { Geist_Mono } from "next/font/google";

const geist = Geist_Mono({
	subsets: ["latin"],
	weight: ["500", "700"],
});

export default function TypewriterHeader({
	targetText,
	baseSpeed = 200,
}: {
	targetText: string;
	baseSpeed?: number;
}) {
	const [text, setText] = useState("");
	const [underscore, setUnderscore] = useState("_");
	useEffect(() => {
		if (text.length === targetText.length) return;
		const speed = baseSpeed / Math.pow(1.25, -(text.length + 1));
		const timer = setTimeout(() => {
			setText(targetText.substring(0, text.length + 1));
		}, speed);
		return () => {
			clearTimeout(timer);
		};
	}, [text]);

	useEffect(() => {
		const timer = setTimeout(() => {
			setUnderscore(underscore.length >= 1 ? "" : "_");
		}, 500);
		return () => {
			clearTimeout(timer);
		};
	}, [underscore]);

	return (
		<p className={`${geist.className} text-4xl w-fit`}>
			<span> $ </span>
			<span className="text-gray-400">hello, i'm</span>{" "}
			<span className="font-bold">{text}</span>
			<span className="text-gray-400">{underscore}</span>{" "}
		</p>
	);
}
