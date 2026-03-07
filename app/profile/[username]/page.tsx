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
  profile: {
    displayName: string;
    profileImage?: string;
  };
};

export default async function ProfilePage({ 
  params 
}: { 
  params: Promise<{ username: string }> 
}) {
  const { username } = await params;
  
  await connectDB();

  const profileUser = await User.findOne({ username })
    .select("-password")
    .lean();

  if (!profileUser) {
    notFound();
  }

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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
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

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Posts</h2>
        {cleanedPosts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-500">No posts yet</p>
            {isOwnProfile && (
              <Link 
                href="/feed"
                className="inline-block mt-4 px-6 py-3 bg-linear-to-r from-pink-500 to-purple-600 text-white rounded-full font-semibold hover:shadow-lg transition"
              >
                Create Your First Post
              </Link>
            )}
          </div>
        ) : (
          cleanedPosts.map((post) => (
            <PostCard 
              key={post._id} 
              post={post} 
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>
    </div>
  );
}