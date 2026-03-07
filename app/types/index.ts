// export interface User {
//   id: string;
//   username: string;
//   email: string;
//   profileType: 'parent' | 'expert' | 'brand';
//   profile: {
//     displayName: string;
//     bio?: string;
//     profileImage?: string;
//     location?: string;
//     kids?: Array<{
//       name: string;
//       birthYear: number;
//       gender: string;
//     }>;
//   };
//   stats: {
//     followers: number;
//     following: number;
//     posts: number;
//   };
// }

// export interface MilestoneData {
//   category: string;
//   description?: string;
//   achievedAt?: string;
// }

// export interface Post {
//   _id: string;
//   authorId: {
//     _id: string;
//     username: string;
//     profile: {
//       displayName: string;
//       profileImage?: string;
//     };
//   };
//   type: 'milestone' | 'update' | 'question' | 'review';
//   content: string;
//   images?: string[];
//   videos?: string[];
//   hashtags?: string[];
//   engagement: {
//     likes: number;
//     comments: number;
//     shares: number;
//     saves: number;
//   };
//   visibility: 'public' | 'followers' | 'group' | 'private';
//   milestoneData?: {              // ✅ Added this
//     babyName: string;
//     ageMonths: number;
//     category: string;
//   };
//   createdAt: string;
//   updatedAt: string;
// }

// export interface Comment {
//   _id: string;
//   postId: string;
//   authorId: {
//     _id: string;
//     username: string;
//     profile: {
//       displayName: string;
//       profileImage?: string;
//     };
//   };
//   content: string;
//   likes: number;
//   createdAt: string;
//   replies?: Comment[];
// }


export interface User {
  id: string;
  username: string;
  email: string;

  profileType: "parent" | "expert" | "brand";

  profile: {
    displayName: string;
    bio?: string;
    profileImage?: string;
    location?: string;

    kids?: Array<{
      name: string;
      birthYear: number;
      gender: string;
    }>;
  };

  stats: {
    followers: number;
    following: number;
    posts: number;
  };
}

// ==============================
// MILESTONE TYPE
// ==============================

export interface MilestoneData {
  category: string;
  description?: string;
  achievedAt?: string;
}

// ==============================
// COMMENT TYPE
// ==============================

export interface Comment {
  _id: string;
  postId: string;

  authorId: {
    _id: string;
    username: string;
    profile: {
      displayName: string;
      profileImage?: string;
    };
  };

  content: string;
  likes: number;
  createdAt: string;

  replies?: Comment[];
}

// ==============================
// POST TYPE
// ==============================

export interface Post {
  _id: string;

  authorId: {
    _id: string;
    username: string;
    profile: {
      displayName: string;
      profileImage?: string;
    };
  };

  type: "milestone" | "update" | "question" | "review";

  content: string;

  images?: string[];
  videos?: string[];
  hashtags?: string[];

  engagement: {
    likes: number;
    comments: number;
    shares: number;
    saves: number;
  };

  visibility: "public" | "followers" | "group" | "private";

  milestoneData?: {
    babyName: string;
    ageMonths: number;
    category: string;
  };

  createdAt: string;
  updatedAt: string;
}

export interface PostWithComments extends Post {
  comments: Comment[];
}
