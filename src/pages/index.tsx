import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { type RouterOutputs, api } from "~/utils/api";
// import { api } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { LoadingPage } from "~/components/loading";
import { useState } from "react";
import toast from "react-hot-toast";

dayjs.extend(relativeTime)

const CreatePostWizard = () => {

  const { user } = useUser()
  const ctx = api.useContext()
  const [input, setInput] = useState<string>('')

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      setInput('')
      void ctx.posts.getAll.invalidate()
      toast.success('Posted!')
    },
    // THESE CALLBACKS ARE EXECUTING BUT NOT SHOWING TOASTS OR CONSOLE LOG
    onError: () => {
      toast.error('Failed to post, please try again later!')
    }
  });
  

  if (!user) return null;

  return (<div className="flex gap-4 w-full">
    <Image 
      src={ user.imageUrl } 
      alt="profile image" 
      className="w-14 h-14 rounded-full"
      width={56}
      height={56}
    />
    <input 
      placeholder="Tweet something!" 
      className="bg-transparent grow outline-none"
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      disabled={isPosting}
    />
    <button onClick={() => mutate({ content: input })}> Post! </button>
  </div>
  )
}


type PostWithUser = RouterOutputs['posts']['getAll'][number];
const PostView = (props: PostWithUser) => {
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
          <span>{`@${author.username}`}</span>
          <span className="font-thin">
            {` · ${dayjs(post.createdAt).fromNow()}`} 
          </span>
        </div>
        <span>{post.content}</span>
      </div>
    </div>
  )
}

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery()

  if (postsLoading) return <LoadingPage/>

  if (!data) return <div>Something went wrong!</div>

  return (
    <div>
      {data.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id}/>
      ))}
    </div>
  )

}

const Home: NextPage = () =>{

  const {isLoaded: userLoaded, isSignedIn} = useUser()

  //fetch asap
  api.posts.getAll.useQuery()

  //return empty div if user is not loaded
  if (!userLoaded) return <div/>

  return (
    <>
      <Head>
        <title>CRUD-tastic!</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x md:max-w-2xl">
          <div className="flex border-b border-slate-400 p-4">

            {/* Render Sign In/Sign Out buttons based on user state */}
            {!isSignedIn && (
              <div className="flex justify-center">
                <SignInButton />
              </div>
            )} 
            {isSignedIn && <CreatePostWizard/>}

          </div>
          <Feed />
        </div>
      </main>
    </>
  )
}

export default Home