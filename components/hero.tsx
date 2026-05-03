import TypewriterHeader from "../components/typewriter-header";
import ReactiveGrid from "../components/reactive-grid";

export default function Hero() {
	return (
		<div className="relative h-full w-full p-8 flex items-center bg-white dark:bg-black">
			<div>
				<TypewriterHeader targetText="Mikołaj" />
			</div>
			<div className="absolute top-0 right-0 h-full w-1/2 invert dark:invert-0 ">
				<ReactiveGrid />
			</div>
		</div>
	);
}
