import { type MetaFunction } from '@remix-run/node'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '#app/components/ui/tooltip.tsx'
import { cn } from '#app/utils/misc.tsx'
import { logos } from './logos/logos.ts'
import {Link} from "@remix-run/react";
import {Button} from "#app/components/ui/button.tsx";

export const meta: MetaFunction = () => [{ title: 'Epic Notes' }]

// Tailwind Grid cell classes lookup
const columnClasses: Record<(typeof logos)[number]['column'], string> = {
	1: 'xl:col-start-1',
	2: 'xl:col-start-2',
	3: 'xl:col-start-3',
	4: 'xl:col-start-4',
	5: 'xl:col-start-5',
}
const rowClasses: Record<(typeof logos)[number]['row'], string> = {
	1: 'xl:row-start-1',
	2: 'xl:row-start-2',
	3: 'xl:row-start-3',
	4: 'xl:row-start-4',
	5: 'xl:row-start-5',
	6: 'xl:row-start-6',
}

export default function Index() {
	return (
		<main className="font-poppins grid h-full place-items-center">
			<div className="grid place-items-center px-4 py-16 xl:grid-cols-2 xl:gap-24">
				<div className="flex max-w-md flex-col items-center text-center xl:order-2 xl:items-start xl:text-left">
					<h1
						data-heading
						className="font-tinos mt-8 animate-slide-top text-4xl font-medium text-foreground [animation-delay:0.3s] [animation-fill-mode:backwards] md:text-5xl xl:mt-4 xl:animate-slide-left xl:text-6xl xl:[animation-delay:0.8s] xl:[animation-fill-mode:backwards]"
					>
						<a href="#">Romanum</a>
					</h1>
					<p
						data-paragraph
						className="mt-6 animate-slide-top text-xl/7 text-muted-foreground [animation-delay:0.8s] [animation-fill-mode:backwards] xl:mt-8 xl:animate-slide-left xl:text-xl/6 xl:leading-10 xl:[animation-delay:1s] xl:[animation-fill-mode:backwards]"
					>
						Welcome to Romanum, a place to connect.
						<Button asChild variant="default" size="lg">
							<Link to="/login">Log In</Link>
						</Button>
					</p>

				</div>
				<div>
					<svg width="100%" height="100%" viewBox="0 0 117 123" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path fillRule="evenodd" clipRule="evenodd"
							  d="M67.9714 8.94545H0V0H67.9714C76.0953 -2.66595e-06 86.4002 1.25588 94.8105 6.41522C103.571 11.7893 109.757 21.0935 109.757 35.7818C109.757 50.5204 103.383 59.4035 95.0768 64.2573C94.8864 64.3686 94.6952 64.4777 94.5033 64.5844C95.3077 65.0281 96.1038 65.5153 96.8873 66.0502C105.943 72.2333 112.129 83.9061 111.426 104.147L111.421 104.276C111.376 105.562 111.334 106.753 111.667 107.775C111.81 108.216 111.978 108.452 112.127 108.593C112.252 108.711 112.562 108.953 113.34 109.095L117 109.763V123H70.7571V118.527C70.7571 112.2 70.6968 107.073 70.2086 102.836C69.7204 98.5985 68.8453 95.6965 67.5143 93.6282C65.3982 90.3399 61.208 87.8546 50.7 87.3237V98.4H60.7286V107.345H8.91429V114.055H60.7286V123H0V98.4H10.0286V24.0409H0V15.0955H18.9429V98.4H25.9071V15.0955H34.8214V98.4H41.7857V15.0955H60.7286V24.0409H50.7V78.3681C62.4817 78.9014 70.479 81.7456 75.0028 88.7753C77.4047 92.5075 78.5074 96.9785 79.0639 101.809C79.4843 105.458 79.6163 109.567 79.6556 114.055H105.05C104.147 112.921 103.566 111.697 103.193 110.55C102.338 107.924 102.457 105.214 102.506 104.093C102.511 103.994 102.514 103.908 102.517 103.835C103.151 85.6103 97.6367 77.3816 91.8727 73.4462C87.449 70.4258 82.2125 69.4483 77.6238 69.259C75.6277 69.3927 73.7967 69.3931 72.2295 69.3228L72.1633 60.3898C73.6686 60.2997 75.4776 60.2379 77.4836 60.3008C81.6698 59.9725 86.474 58.9328 90.591 56.527C96.0739 53.3231 100.843 47.4323 100.843 35.7818C100.843 24.0811 96.1649 17.7307 90.161 14.0475C83.8069 10.1496 75.4476 8.94545 67.9714 8.94545Z"
							  fill="#232B20"
						/>
					</svg>

				</div>
			</div>
		</main>
	)
}
