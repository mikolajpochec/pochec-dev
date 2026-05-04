import TypewriterHeader from "../components/typewriter-header";
import ReactiveGrid from "../components/reactive-grid";
import Button from "../components/button";

export default function Hero() {
	return (
		<div className="relative h-full w-full p-32 flex items-center bg-white dark:bg-black">
			<div className="flex gap-5 flex-col z-2">
				<TypewriterHeader targetText="Mikołaj" />
				<p className="text-gray-300 max-w-1/2 text-justify">
					This is an eigenspace of Mikołaj Pocheć, a computer science student
					based in Cracow, Poland. I'm into software development, cybersecurity
					and low level programming.
				</p>
				<Button color="indigo" text="Read more..." />
			</div>
			<div className="absolute top-0 right-0 h-full w-1/2 invert dark:invert-0 z-1">
				<ReactiveGrid cursorRepelForce={2.5} />
			</div>
		</div>
	);
}
