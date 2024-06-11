import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import Pagination from '#app/components/pagination.tsx'
import Postcard from '#app/components/ui/postcard.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { useOptionalUser } from '#app/utils/user.js'

export async function loader({ params }: LoaderFunctionArgs) {
	async function getAllPosts(page: number, pageSize: number) {
		const skip = (page - 1) * pageSize
		return prisma.note.findMany({
			where: { public: true },
			take: pageSize,
			skip: skip,
			orderBy: {
				createdAt: 'desc',
			},
			include: {
				owner: {
					include: {
						image: true,
					},
				},
				images: true,
			},
		})
	}

	const posts = await getAllPosts(1, 10)

	invariantResponse(posts, 'No posts+ exist', { status: 404 })

	return json({ posts: posts })
}

export default function PostsRoute() {
	const data = useLoaderData<typeof loader>()
	const user = useOptionalUser()
	console.log('user', user)
	console.log('data', data)

	return (
		<>
			<main className="container flex h-full min-h-[400px] flex-row px-0 py-5 pb-12 md:px-8">
				<section className="w-3/4 pr-4">
					{data.posts.map(post => (
						<Postcard key={post.id} post={post} />
					))}
				</section>
				<aside className="h-fit w-1/4 overflow-hidden rounded bg-white">
					<img src="/family.jpg" alt="Roman Family" />
					<div className="p-4">
						<h2 className="text-2xl font-bold">Welcome to Romanum,</h2>
						<p>
							Now you may be thinking what is Romanum, you can read more about
							what the plan and goal of Romanum is on our{' '}
							<Link to="/about">about page</Link>
						</p>
					</div>
				</aside>
			</main>
			<Pagination />
		</>
	)
}
