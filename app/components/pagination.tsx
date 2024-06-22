import {
	ArrowLongLeftIcon,
	ArrowLongRightIcon,
} from '@heroicons/react/20/solid'
import { Form } from '@remix-run/react'
import { Button } from '#app/components/ui/button'

export default function Pagination({ totalPostCount }: { totalPostCount: number }) {
	const pagesToShow = Math.round(totalPostCount / 10);
	const postsCount = new Array(pagesToShow).fill({})

	return (
		<Form
			action="/posts"
			method="POST"
		>
			<nav className="mb-10 flex items-center justify-center px-4 sm:px-0">
				<div className="-mt-px flex">
					<Button
						type="submit"
						name="intent"
						variant="outline"
                        value={-1}
						className="bg-romanumDark hover:bg-lime-950 mr-6 text-white inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium"
					>
						<ArrowLongLeftIcon
							className="mr-3 h-5 w-5"
							aria-hidden="true"
						/>
						Previous
					</Button>
				</div>
				<div className="hidden md:-mt-px md:flex">
					{postsCount.map((_, i) => (
						<Button
							key={i}
							name="intent"
							variant="outline"
							value={i + 1}
							className="bg-romanumDark hover:bg-lime-950 text-white inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium hover:border-gray-300"
						>
							{i + 1}
						</Button>
					))}
				</div>
				<div className="-mt-px flex justify-end">
					<Button
						type="submit"
                        value={1}
						name="intent"
						variant="outline"
						className="bg-romanumDark hover:bg-lime-950 ml-6 text-white inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium"
					>
						Next
						<ArrowLongRightIcon
							className="ml-3 h-5 w-5"
							aria-hidden="true"
						/>
					</Button>
				</div>
			</nav>
		</Form>
	)
}
