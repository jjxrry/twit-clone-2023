import { type RouterOutputs } from "~/utils/api";
// import { api } from "~/utils/api";

import Image from "next/image";
import dayjs from "dayjs";
import Link from "next/link";

import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime)

type PostWithUser = RouterOutputs['posts']['getAll'][number];

export const PostView = (props: PostWithUser) => {
  const {post, author} = props;
  return (
    <div key={post.id} className=" flex border-b border-slate-400 p-4 gap-3">
      <Image 
        className="h-14 w-14 rounded-full" 
        src={author.imageUrl} 
        alt={`@${author.username}'s profile picture`}
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-400">
          <Link href={`/@${author.username}`}>
            <span>{`${author.username}`}</span>
          </Link>
          <Link href={`/post/${post.id}`}>
            <span className="font-thin">
              {` · ${dayjs(post.createdAt).fromNow()}`} 
            </span>
          </Link>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  )
}