'use client';

interface UserStatsProps {
  stats: {
    followers: number;
    following: number;
    posts: number;
  };
  username: string;
}

export default function UserStats({ stats, username }: UserStatsProps) {
  return (
    <div className="flex items-center space-x-6 pt-3 border-t border-gray-200">
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-900">{stats.posts}</p>
        <p className="text-sm text-gray-600">Posts</p>
      </div>
      <button className="text-center hover:underline">
        <p className="text-2xl font-bold text-gray-900">{stats.followers}</p>
        <p className="text-sm text-gray-600">Followers</p>
      </button>
      <button className="text-center hover:underline">
        <p className="text-2xl font-bold text-gray-900">{stats.following}</p>
        <p className="text-sm text-gray-600">Following</p>
      </button>
    </div>
  );
}