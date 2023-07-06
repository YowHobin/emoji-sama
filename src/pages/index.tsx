import Head from "next/head";

import {
  SignInButton,
  useUser,
} from "@clerk/nextjs";

import { type NextPage } from "next";

import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";

import dayjs from "dayjs";
import "dayjs/locale/en"; // Optionally, import the desired locale

// Import any additional Day.js plugins if needed
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);


import Image from "next/image";
import { LoadingPage } from "~/components/loading";




const CreatePostWizard = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="flex w-full gap-3">
      <Image
        src={user.profileImageUrl}
        alt="Profile Image"
        className="h-14 w-14 rounded-full"
        width={56}
        height={56}
      />
      <input
        placeholder="Type some emojis!"
        className="grow bg-transparent outline-none"
      />
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props:  PostWithUser ) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex gap-3 border-b border-slate-400 p-4 ">
      <Image
        src={author.profileImageUrl}
        className="h-14 w-14 rounded-full"
        alt={`@${author.username}`}
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex gap-1 text-slate-200">
          <span className="font-semibold">{`@${author.username}`}</span>
          <span className="font-thin">{` ◦ ${dayjs(
            post.createdAt
          ).fromNow()}`}</span>
        </div>
        <span className="text-xl">{post.content}</span>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading: postsLoading } = api.posts.getAll.useQuery();

  if (postsLoading) return <LoadingPage />;
  if (!data) return <div>Something went wrong</div>;

  return (
    <div className="flex flex-col">
      {[...data!, ...data!]?.map((fullPost) => (
        <PostView {...fullPost} key={fullPost.post.id} />
      ))}
    </div>
  );
};

const Home: NextPage = () => {
  const {isLoaded: userLoaded, isSignedIn} = useUser();

  api.posts.getAll.useQuery();

  if (!userLoaded) return <div />;



  return (
    <>
      <Head>
        <title>Emoji-sama</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          <div className="border-b border-slate-400 p-4">
            {!isSignedIn && (
              <div className="justify-center">
                <SignInButton />{" "}
              </div>
            )}

            {isSignedIn && <CreatePostWizard />}
          </div>
          
          <Feed />
        </div>
      </main>
    </>
  );
};
export default Home;
