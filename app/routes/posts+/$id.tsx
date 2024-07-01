import { invariantResponse } from "@epic-web/invariant";
import { type LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { formatDistanceToNow } from "date-fns";
import { prisma } from '#app/utils/db.server.ts';
import {getNoteImgSrc, getUserImgSrc} from "#app/utils/misc.tsx";


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
                {data.post.images.length && (
                    <div className="h-72 w-full overflow-hidden flex items-center justify-center">
                        <img src={getNoteImgSrc(data.post.images[0].id)} alt="Post header" />
                    </div>
                )}
                <div className="container mt-10">

                    <h1 className="font-tinos text-romanumDark text-h1">{data.post.title}</h1>

                    <div className="font-sourceSansPro text-romanumDark text-body-lg">{data.post.content}</div>
                </div>
            </div>
        </div>

    )
}