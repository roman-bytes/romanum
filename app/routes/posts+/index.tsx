import { invariantResponse } from '@epic-web/invariant'
import {json, type LoaderFunctionArgs, type ActionFunctionArgs, redirect} from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'
import Pagination from '#app/components/pagination.tsx'
import Postcard from '#app/components/ui/postcard.tsx'
import { prisma } from '#app/utils/db.server.ts'
import { useOptionalUser } from '#app/utils/user.js'

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

export async function action({ request }: ActionFunctionArgs) {
	const formData = await request.formData();
	const intent = parseInt(formData.get("intent") as string);
	const page = parseInt(new URL(request.url).searchParams.get('page') as string ?? 1)

	if (page === 1 && intent === -1) {
		return redirect('/posts')
	}

	const currentPage = page + intent;
	const posts = await getAllPosts(currentPage, 10)

	console.log('currentPage', currentPage)

	invariantResponse(posts, 'No posts+ exist', { status: 404 })

	return redirect(`/posts?page=${currentPage}`)
}

export async function loader(  { request }: LoaderFunctionArgs) {
	const page = parseInt(new URL(request.url).searchParams.get('page') as string ?? 1)
	const posts = await getAllPosts(page, 10)
	const totalPostCount = await prisma.note.findMany({
		where: { public: true },
	});

	invariantResponse(posts, 'No posts+ exist', { status: 404 })

	return json({ posts, totalPostCount: totalPostCount.length })
}

export default function PostsRoute() {
	const data = useLoaderData<typeof loader>()
	const user = useOptionalUser()
	console.log('user', user)
	//console.log('data', data)

	return (
		<>
			<main className="container flex min-h-[400px] flex-row px-0 py-5 pb-12 md:px-8">
				<section className="w-3/4 pr-4">
					{data.posts.map(post => (
						<Postcard key={post.id} post={post} />
					))}
				</section>
				<aside className="h-fit w-1/4 overflow-hidden rounded-lg bg-white border">
					<img src="/family.jpg" alt="Roman Family" />
					<div className="p-4">
						<h2 className="text-2xl font-bold">Welcome to Romanum,</h2>
						<p>
							Now you may be thinking what is Romanum, you can read more about
							what the plan and goal of Romanum is on our{' '}
							<Link className="underline" to="/about">about page</Link>
						</p>
					</div>
				</aside>
			</main>
			<Pagination totalPostCount={data.totalPostCount}/>
		</>
	)
}