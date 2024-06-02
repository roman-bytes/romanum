import { invariantResponse } from '@epic-web/invariant'
import { json, type LoaderFunctionArgs } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { prisma } from '#app/utils/db.server.ts'
import { useOptionalUser } from '#app/utils/user.js'
import Postcard from '#app/components/ui/postcard.tsx';

export async function loader({ params }: LoaderFunctionArgs) {
	const allPosts = await prisma.note.findMany({
		orderBy: {
			createdAt: 'desc',
		},
		where: {
			public: true,
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

	invariantResponse(allPosts, 'No posts exist', { status: 404 })

	return json({ posts: allPosts })
}

export default function PostsRoute() {
	const data = useLoaderData<typeof loader>()
	const user = useOptionalUser()

	console.log('POST DATA: ', data)
	console.log('USER DATA: ', user)

	return (
		<main className="container flex h-full min-h-[400px] flex-row px-0 py-5 pb-12 md:px-8">
			<section className="w-3/4 pr-4">
				{data.posts.map(post => (
					<Postcard key={post.id} post={post} />
				))}
			</section>
			<aside className="w-1/4 bg-white rounded">Romanus</aside>
		</main>
	)
}
