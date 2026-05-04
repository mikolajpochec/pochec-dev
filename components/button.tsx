import FancyPanel from "./fancy-panel";

export default function Button({
	text = "Button",
	color = "white",
}: {
	text?: string;
	color?: string;
}) {
	return (
		<FancyPanel
			glowColor={color}
			className="border border-foreground select-none w-fit px-6 py-3 cursor-pointer"
			maxTilt={8}
		>
			{text}
		</FancyPanel>
	);
}
