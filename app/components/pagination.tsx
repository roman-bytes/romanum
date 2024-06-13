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
			<nav className="mb-10 flex items-center justify-between border-t border-gray-200 px-4 sm:px-0">
				<div className="-mt-px flex w-0 flex-1">
					<Button
						type="submit"
						name="intent"
                        value={-1}
						className="inline-flex items-center border-t-2 border-transparent pr-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
					>
						<ArrowLongLeftIcon
							className="mr-3 h-5 w-5 text-gray-400"
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
							value={i + 1}
							className="inline-flex items-center border-t-2 border-transparent px-4 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
						>
							{i + 1}
						</Button>
					))}
				</div>
				<div className="-mt-px flex w-0 flex-1 justify-end">
					<Button
						type="submit"
                        value={1}
						name="intent"
						className="inline-flex items-center border-t-2 border-transparent pl-1 pt-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
					>
						Next
						<ArrowLongRightIcon
							className="ml-3 h-5 w-5 text-gray-400"
							aria-hidden="true"
						/>
					</Button>
				</div>
			</nav>
		</Form>
	)
}
