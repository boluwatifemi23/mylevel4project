import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/mongodb";
import { User } from "@/models/User";
import { Post as PostModel } from "@/models/Post";
import { getSession } from "@/lib/auth/session";
import type { Post } from "@/app/types";
import ProfileHeader from "@/app/components/profile/ProfileHeader";
import PostCard from "@/app/components/feed/PostCard";
import { Types } from "mongoose";
import Link from "next/link";

type PopulatedAuthor = {
  _id: Types.ObjectId;
  username: string;
  profile: { displayName: string; profileImage?: string };
};

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  await connectDB();

  const profileUser = await User.findOne({ username }).select("-password").lean();
  if (!profileUser) notFound();

  const session = await getSession();
  const currentUserId = session?.userId;
  const isOwnProfile = currentUserId === profileUser._id.toString();

  const userPosts = await PostModel.find({ authorId: profileUser._id })
    .sort({ createdAt: -1 })
    .populate("authorId", "username profile.displayName profile.profileImage")
    .lean();

  const cleanedPosts: Post[] = userPosts.map((post) => {
    const author = post.authorId as unknown as PopulatedAuthor;
    return {
      ...post,
      _id: post._id.toString(),
      authorId: {
        _id: author._id.toString(),
        username: author.username,
        profile: {
          displayName: author.profile.displayName,
          profileImage: author.profile.profileImage || "",
        },
      },
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      engagement: {
        likes: post.engagement?.likes ?? 0,
        comments: post.engagement?.comments ?? 0,
        shares: post.engagement?.shares ?? 0,
        saves: post.engagement?.saves ?? 0,
      },
      milestoneData: post.milestoneData
        ? {
            babyName: post.milestoneData.babyName,
            ageMonths: post.milestoneData.ageMonths,
            category: post.milestoneData.category,
          }
        : undefined,
    };
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8 space-y-5">
        <ProfileHeader
          user={{
            id: profileUser._id.toString(),
            username: profileUser.username,
            profile: profileUser.profile,
            stats: profileUser.stats,
            createdAt: profileUser.createdAt.toISOString(),
          }}
          isOwnProfile={isOwnProfile}
          currentUserId={currentUserId}
        />

        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-4">Posts</h2>
          {cleanedPosts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <div className="text-4xl mb-3">📝</div>
              <p className="font-semibold text-gray-800 mb-1">No posts yet</p>
              {isOwnProfile && (
                <Link
                  href="/feed"
                  className="inline-block mt-3 px-5 py-2.5 bg-linear-to-r from-pink-500 to-purple-600 text-white rounded-xl text-sm font-semibold hover:shadow-md transition"
                >
                  Create Your First Post
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {cleanedPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}