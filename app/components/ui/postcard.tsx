import { Link } from '@remix-run/react'
import { getNoteImgSrc, getUserImgSrc } from "#app/utils/misc.tsx";

export default function Postcard({ post }) {
    return (
        <article
            key={post.id}
            className="relative border isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 mb-8 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
        >
            <img src={getNoteImgSrc(post?.images[0]?.id)} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover"/>
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40"/>
            <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10"/>

            <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                <time dateTime={post.createdAt} className="mr-8">
                    {post.createdAt}
                </time>
                <div className="-ml-4 flex items-center gap-x-4">
                    <svg viewBox="0 0 2 2" className="-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50">
                        <circle cx={1} cy={1} r={1}/>
                    </svg>
                    <div className="flex gap-x-2.5">
                        <img src={getUserImgSrc(post.owner.image?.id)} alt="" className="h-6 w-6 flex-none rounded-full bg-white/10"/>
                        {post.owner.name}
                    </div>
                </div>
            </div>
            <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
                <Link to={`/posts/${post.id}`}>
                    <span className="absolute inset-0"/>
                    {post.title}
                </Link>
            </h3>
        </article>
    );
}