import {
	ChevronLeftIcon,
	ChevronRightIcon,
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
				<div className="flex border-romanumDark">
					<Button
						type="submit"
						name="intent"
						variant="outline"
                        value={-1}
						className="hover:bg-transparent text-romanumDark inline-flex items-center border-transparent text-sm font-medium"
					>
						<ChevronLeftIcon
							className="mr-3 h-5 w-5 hover:text-white"
							aria-hidden="true"
						/>
					</Button>
				</div>
				<div className="md:-mt-px md:flex bg-white rounded">
					{postsCount.map((_, i) => (
						<Button
							key={i}
							name="intent"
							variant="outline"
							value={i + 1}
							className="bg-transparent hover:rounded border-transparent text-romanumDark inline-flex items-center text-sm font-medium"
						>
							{i + 1}
						</Button>
					))}
				</div>
				<div className="flex justify-end">
					<Button
						type="submit"
                        value={1}
						name="intent"
						variant="outline"
						className="hover:bg-transparent text-romanumDark inline-flex items-center border-transparent text-sm font-medium"
					>
						<ChevronRightIcon
							className="ml-3 h-5 w-5 hover:text-white"
							aria-hidden="true"
						/>
					</Button>
				</div>
			</nav>
		</Form>
	)
}
