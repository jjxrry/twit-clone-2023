import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUserName.useQuery({
    username,
  })

  if (!data) return <div>404</div>

  return (
    <>
      <Head>
        <title>{data.username}</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div>
          {`@${data.username}`}
        </div>
      </main>
    </>
  )
}

import { createServerSideHelpers } from '@trpc/react-query/server';
import { appRouter } from '~/server/api/root';
import { prisma } from '~/server/db';
import superjson from 'superjson';


export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: {prisma, userID: null},
    transformer: superjson, // optional - adds superjson serialization
  })

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug")

  const username = slug.replace('@', '');

  await ssg.profile.getUserByUserName.prefetch({ username })

  return{
    props: {
      trpcState: ssg.dehydrate(),
      username,
    }
  }
}

export const getStaticPaths = () => {
  return { paths: [], fallback: 'blocking'}
}

export default ProfilePage