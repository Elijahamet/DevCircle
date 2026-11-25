export type PostType =
  | 'discussion'
  | 'question'
  | 'project'
  | 'code'
  | 'career'
  | 'resource';

export type PostCategory =
  | 'for_you'
  | 'following'
  | 'ghana_tech'
  | 'web_dev'
  | 'mobile_dev'
  | 'ai_ml'
  | 'career_advice';

export interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  role: string;
  bio: string;
  location: string;
  skills: string[];
  githubUrl: string;
  portfolioUrl: string;
  websiteUrl: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
  isVerified?: boolean;
  joinedDate: string;
  education?: string;
  experience?: string;
}

export interface CodeSnippet {
  language: 'javascript' | 'typescript' | 'python' | 'go' | 'java';
  code: string;
  fileName?: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: User;
  content: string;
  createdAt: string;
  likesCount: number;
  isLiked: boolean;
  parentCommentId?: string;
  isAuthorSelf?: boolean;
}

export type MediaType = 'image' | 'video';

export interface Post {
  id: string;
  author: User;
  type: PostType;
  category: PostCategory;
  title?: string;
  content: string;
  codeSnippet?: CodeSnippet;
  imageUrl?: string;
  videoUrl?: string;
  mediaType?: MediaType;
  videoDuration?: string;
  projectMeta?: {
    name: string;
    demoUrl?: string;
    githubUrl?: string;
    techStack: string[];
  };
  tags: string[];
  likesCount: number;
  isLiked: boolean;
  commentsCount: number;
  bookmarksCount: number;
  isBookmarked: boolean;
  createdAt: string;
  comments: Comment[];
  isAuthorSelf?: boolean;
  communityId?: string;
  communityName?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  author: User;
  technologies: string[];
  githubUrl: string;
  demoUrl?: string;
  category: string;
  likesCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
}

export type OpportunityType =
  | 'hackathon'
  | 'meetup'
  | 'workshop'
  | 'internship'
  | 'scholarship'
  | 'job';

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  description: string;
  type: OpportunityType;
  location: string;
  isOnline: boolean;
  dateOrDeadline: string;
  isBookmarked: boolean;
  tags: string[];
  link?: string;
}

export type NotificationType =
  | 'like'
  | 'comment'
  | 'follow'
  | 'mention'
  | 'opportunity';

export interface Notification {
  id: string;
  type: NotificationType;
  actor: User;
  message: string;
  targetId?: string;
  targetType?: 'post' | 'project' | 'profile' | 'opportunity';
  isRead: boolean;
  createdAt: string;
}

export interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  topicsCount: number;
  color: string;
}

export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  avatar: string;
  bannerUrl?: string;
  category: string;
  membersCount: number;
  postsCount: number;
  isJoined?: boolean;
  createdAt: string;
  creator: User;
  tags: string[];
}

export interface CreateCommunityInput {
  name: string;
  description: string;
  category: string;
  avatar?: string;
  bannerUrl?: string;
  tags: string[];
}
