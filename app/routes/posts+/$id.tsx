import { invariantResponse } from "@epic-web/invariant";
import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { formatDistanceToNow } from "date-fns";
import { prisma } from '#app/utils/db.server.ts';
import {getUserImgSrc} from "#app/utils/misc.tsx";


export async function loader({ params }: LoaderFunctionArgs) {
    const post = await prisma.note.findUnique({
        where: { id: params.id },
        select: {
            id: true,
            title: true,
            content: true,
            ownerId: true,
            updatedAt: true,
            images: {
                select: {
                    id: true,
                    altText: true,
                }
            },
        },
    })

    const author = await prisma.user.findFirst({
        select: {
            id: true,
            name: true,
            username: true,
            image: { select: { id: true}},
        },
        where: { id: post?.ownerId },
    });

    invariantResponse(post, 'Not found', { status: 404 })

    const date = new Date(post.updatedAt)
    const timeAgo = formatDistanceToNow(date);

    return json({
        post,
        author,
        timeAgo,
    })
}


export default function PostRoute() {
    const data = useLoaderData<typeof loader>();
    console.log('SINGLE POST DATA', data);

    return (
        <div className="container flex flex-row flex-nowrap">
            <div className="w-1/4">
                <div className="flex">
                    <img
                        src={getUserImgSrc(data.author?.image?.id)}
                        alt=""
                        className="w-8 h-8 rounded-full"
                    />
                    <div>
                        <div>{data.author?.name}</div>
                        <div>{data.post.updatedAt}</div>
                    </div>
                </div>

            </div>
            <div className="w-3/4">
                <h1>{data.post.title}</h1>
                <div>{data.post.content}</div>
            </div>
        </div>

    )
}