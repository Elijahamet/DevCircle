import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  Post,
  Project,
  Opportunity,
  Notification,
  Comment,
  PostType,
  PostCategory,
  CodeSnippet,
} from '@/types';
import {
  CURRENT_USER,
  DEMO_USERS,
  MOCK_POSTS,
  MOCK_PROJECTS,
  MOCK_OPPORTUNITIES,
  MOCK_NOTIFICATIONS,
} from '@/data/mockData';
import { Themes, ThemeType, ThemeColors } from '@/constants/theme';

interface CreatePostInput {
  type: PostType;
  category: PostCategory;
  title?: string;
  content: string;
  codeSnippet?: CodeSnippet;
  imageUrl?: string;
  projectMeta?: {
    name: string;
    demoUrl?: string;
    githubUrl?: string;
    techStack: string[];
  };
  tags: string[];
}

interface DevCircleContextType {
  currentUser: User;
  users: Record<string, User>;
  posts: Post[];
  projects: Project[];
  opportunities: Opportunity[];
  notifications: Notification[];
  followingUserIds: string[];
  savedPostIds: string[];
  recentSearches: string[];
  isAuthenticated: boolean;
  isOnboarded: boolean;
  unreadNotificationsCount: number;

  // Theme
  themeMode: ThemeType;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (mode: ThemeType) => void;

  // Actions
  createPost: (input: CreatePostInput) => Post;
  toggleLikePost: (postId: string) => void;
  toggleBookmarkPost: (postId: string) => void;
  addComment: (postId: string, content: string, parentCommentId?: string) => void;
  deleteComment: (postId: string, commentId: string) => void;
  toggleFollowUser: (userId: string) => void;
  toggleLikeProject: (projectId: string) => void;
  toggleBookmarkProject: (projectId: string) => void;
  toggleBookmarkOpportunity: (oppId: string) => void;
  updateCurrentUser: (data: Partial<User>) => void;
  markNotificationRead: (notifId: string) => void;
  markAllNotificationsRead: () => void;
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;
  login: (email: string, password?: string) => void;
  logout: () => void;
  completeOnboarding: () => void;
  getUserByUsername: (username: string) => User | undefined;
}

const DevCircleContext = createContext<DevCircleContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER: '@devcircle_current_user_v1',
  POSTS: '@devcircle_posts_v1',
  PROJECTS: '@devcircle_projects_v1',
  OPPORTUNITIES: '@devcircle_opportunities_v1',
  NOTIFICATIONS: '@devcircle_notifications_v1',
  FOLLOWING: '@devcircle_following_v1',
  SAVED_POSTS: '@devcircle_saved_posts_v1',
  RECENT_SEARCHES: '@devcircle_recent_searches_v1',
  AUTH: '@devcircle_is_authenticated_v1',
  ONBOARDED: '@devcircle_is_onboarded_v1',
  THEME: '@devcircle_theme_mode_v2',
};

export const DevCircleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [users, setUsers] = useState<Record<string, User>>(DEMO_USERS);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(MOCK_OPPORTUNITIES);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [followingUserIds, setFollowingUserIds] = useState<string[]>([
    'user_ama_osei',
    'user_nana_akua',
    'user_efua_mensah',
  ]);
  const [savedPostIds, setSavedPostIds] = useState<string[]>(['post_2', 'post_3']);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Paystack Webhooks',
    'React Native Ghana',
    'Kubernetes Kumasi',
    'Twi NLP',
  ]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [themeMode, setThemeModeState] = useState<ThemeType>('dark');

  // Load persisted state on mount
  useEffect(() => {
    async function loadPersistedData() {
      try {
        const [
          storedUser,
          storedPosts,
          storedProjects,
          storedOpps,
          storedNotifs,
          storedFollowing,
          storedSaved,
          storedSearches,
          storedAuth,
          storedTheme,
        ] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.USER),
          AsyncStorage.getItem(STORAGE_KEYS.POSTS),
          AsyncStorage.getItem(STORAGE_KEYS.PROJECTS),
          AsyncStorage.getItem(STORAGE_KEYS.OPPORTUNITIES),
          AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS),
          AsyncStorage.getItem(STORAGE_KEYS.FOLLOWING),
          AsyncStorage.getItem(STORAGE_KEYS.SAVED_POSTS),
          AsyncStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES),
          AsyncStorage.getItem(STORAGE_KEYS.AUTH),
          AsyncStorage.getItem(STORAGE_KEYS.THEME),
        ]);

        if (storedUser) setCurrentUser(JSON.parse(storedUser));
        if (storedPosts) setPosts(JSON.parse(storedPosts));
        if (storedProjects) setProjects(JSON.parse(storedProjects));
        if (storedOpps) setOpportunities(JSON.parse(storedOpps));
        if (storedNotifs) setNotifications(JSON.parse(storedNotifs));
        if (storedFollowing) setFollowingUserIds(JSON.parse(storedFollowing));
        if (storedSaved) setSavedPostIds(JSON.parse(storedSaved));
        if (storedSearches) setRecentSearches(JSON.parse(storedSearches));
        if (storedAuth !== null) setIsAuthenticated(JSON.parse(storedAuth));
        if (storedTheme === 'light' || storedTheme === 'dark') setThemeModeState(storedTheme);
      } catch (err) {
        console.warn('Failed to load local DevCircle data from AsyncStorage', err);
      }
    }

    loadPersistedData();
  }, []);

  const persist = async (key: string, data: any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn(`Error persisting ${key}:`, e);
    }
  };

  const toggleTheme = () => {
    const nextMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeModeState(nextMode);
    AsyncStorage.setItem(STORAGE_KEYS.THEME, nextMode).catch(console.warn);
  };

  const setTheme = (mode: ThemeType) => {
    setThemeModeState(mode);
    AsyncStorage.setItem(STORAGE_KEYS.THEME, mode).catch(console.warn);
  };

  const colors = Themes[themeMode];

  const createPost = (input: CreatePostInput): Post => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      author: currentUser,
      type: input.type,
      category: input.category,
      title: input.title,
      content: input.content,
      codeSnippet: input.codeSnippet,
      imageUrl: input.imageUrl,
      projectMeta: input.projectMeta,
      tags: input.tags.length > 0 ? input.tags : ['DevCircle', 'GhanaTech'],
      likesCount: 0,
      isLiked: false,
      commentsCount: 0,
      bookmarksCount: 0,
      isBookmarked: false,
      createdAt: 'Just now',
      comments: [],
      isAuthorSelf: true,
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    persist(STORAGE_KEYS.POSTS, updatedPosts);

    const updatedUser = {
      ...currentUser,
      postsCount: currentUser.postsCount + 1,
    };
    setCurrentUser(updatedUser);
    persist(STORAGE_KEYS.USER, updatedUser);

    return newPost;
  };

  const toggleLikePost = (postId: string) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const nextLiked = !post.isLiked;
        return {
          ...post,
          isLiked: nextLiked,
          likesCount: nextLiked ? post.likesCount + 1 : Math.max(0, post.likesCount - 1),
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    persist(STORAGE_KEYS.POSTS, updatedPosts);
  };

  const toggleBookmarkPost = (postId: string) => {
    let nextSaved = [...savedPostIds];
    const isAlreadySaved = nextSaved.includes(postId);

    if (isAlreadySaved) {
      nextSaved = nextSaved.filter((id) => id !== postId);
    } else {
      nextSaved.unshift(postId);
    }
    setSavedPostIds(nextSaved);
    persist(STORAGE_KEYS.SAVED_POSTS, nextSaved);

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          isBookmarked: !isAlreadySaved,
          bookmarksCount: !isAlreadySaved
            ? post.bookmarksCount + 1
            : Math.max(0, post.bookmarksCount - 1),
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    persist(STORAGE_KEYS.POSTS, updatedPosts);
  };

  const addComment = (postId: string, content: string, parentCommentId?: string) => {
    if (!content.trim()) return;

    const newComment: Comment = {
      id: `c_${Date.now()}`,
      postId,
      author: currentUser,
      content: content.trim(),
      createdAt: 'Just now',
      likesCount: 0,
      isLiked: false,
      parentCommentId,
      isAuthorSelf: true,
    };

    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          commentsCount: post.commentsCount + 1,
          comments: [...post.comments, newComment],
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    persist(STORAGE_KEYS.POSTS, updatedPosts);
  };

  const deleteComment = (postId: string, commentId: string) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        return {
          ...post,
          commentsCount: Math.max(0, post.commentsCount - 1),
          comments: post.comments.filter((c) => c.id !== commentId),
        };
      }
      return post;
    });
    setPosts(updatedPosts);
    persist(STORAGE_KEYS.POSTS, updatedPosts);
  };

  const toggleFollowUser = (userId: string) => {
    const isCurrentlyFollowing = followingUserIds.includes(userId);
    let nextFollowing: string[];

    if (isCurrentlyFollowing) {
      nextFollowing = followingUserIds.filter((id) => id !== userId);
    } else {
      nextFollowing = [...followingUserIds, userId];
    }
    setFollowingUserIds(nextFollowing);
    persist(STORAGE_KEYS.FOLLOWING, nextFollowing);

    const updatedCurrentUser = {
      ...currentUser,
      followingCount: isCurrentlyFollowing
        ? Math.max(0, currentUser.followingCount - 1)
        : currentUser.followingCount + 1,
    };
    setCurrentUser(updatedCurrentUser);
    persist(STORAGE_KEYS.USER, updatedCurrentUser);

    if (users[userId]) {
      const targetUser = users[userId];
      const updatedTargetUser = {
        ...targetUser,
        isFollowing: !isCurrentlyFollowing,
        followersCount: isCurrentlyFollowing
          ? Math.max(0, targetUser.followersCount - 1)
          : targetUser.followersCount + 1,
      };
      const updatedUsers = { ...users, [userId]: updatedTargetUser };
      setUsers(updatedUsers);
    }
  };

  const toggleLikeProject = (projectId: string) => {
    const updatedProjects = projects.map((p) => {
      if (p.id === projectId) {
        const nextLiked = !p.isLiked;
        return {
          ...p,
          isLiked: nextLiked,
          likesCount: nextLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
        };
      }
      return p;
    });
    setProjects(updatedProjects);
    persist(STORAGE_KEYS.PROJECTS, updatedProjects);
  };

  const toggleBookmarkProject = (projectId: string) => {
    const updatedProjects = projects.map((p) => {
      if (p.id === projectId) {
        return { ...p, isBookmarked: !p.isBookmarked };
      }
      return p;
    });
    setProjects(updatedProjects);
    persist(STORAGE_KEYS.PROJECTS, updatedProjects);
  };

  const toggleBookmarkOpportunity = (oppId: string) => {
    const updatedOpps = opportunities.map((o) => {
      if (o.id === oppId) {
        return { ...o, isBookmarked: !o.isBookmarked };
      }
      return o;
    });
    setOpportunities(updatedOpps);
    persist(STORAGE_KEYS.OPPORTUNITIES, updatedOpps);
  };

  const updateCurrentUser = (data: Partial<User>) => {
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    persist(STORAGE_KEYS.USER, updated);
  };

  const markNotificationRead = (notifId: string) => {
    const updated = notifications.map((n) => (n.id === notifId ? { ...n, isRead: true } : n));
    setNotifications(updated);
    persist(STORAGE_KEYS.NOTIFICATIONS, updated);
  };

  const markAllNotificationsRead = () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);
    persist(STORAGE_KEYS.NOTIFICATIONS, updated);
  };

  const addRecentSearch = (query: string) => {
    if (!query.trim()) return;
    const filtered = recentSearches.filter(
      (s) => s.toLowerCase() !== query.trim().toLowerCase()
    );
    const updated = [query.trim(), ...filtered].slice(0, 10);
    setRecentSearches(updated);
    persist(STORAGE_KEYS.RECENT_SEARCHES, updated);
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    persist(STORAGE_KEYS.RECENT_SEARCHES, []);
  };

  const login = (email: string) => {
    setIsAuthenticated(true);
    setIsOnboarded(true);
    persist(STORAGE_KEYS.AUTH, true);
    persist(STORAGE_KEYS.ONBOARDED, true);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setIsOnboarded(false); // Reset so landing pages show upon logout
    persist(STORAGE_KEYS.AUTH, false);
    persist(STORAGE_KEYS.ONBOARDED, false);
  };

  const completeOnboarding = () => {
    setIsOnboarded(true);
    persist(STORAGE_KEYS.ONBOARDED, true);
  };

  const getUserByUsername = (username: string): User | undefined => {
    if (currentUser.username.toLowerCase() === username.toLowerCase()) {
      return currentUser;
    }
    const found = Object.values(users).find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );
    return found;
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <DevCircleContext.Provider
      value={{
        currentUser,
        users,
        posts,
        projects,
        opportunities,
        notifications,
        followingUserIds,
        savedPostIds,
        recentSearches,
        isAuthenticated,
        isOnboarded,
        unreadNotificationsCount,
        themeMode,
        colors,
        toggleTheme,
        setTheme,
        createPost,
        toggleLikePost,
        toggleBookmarkPost,
        addComment,
        deleteComment,
        toggleFollowUser,
        toggleLikeProject,
        toggleBookmarkProject,
        toggleBookmarkOpportunity,
        updateCurrentUser,
        markNotificationRead,
        markAllNotificationsRead,
        addRecentSearch,
        clearRecentSearches,
        login,
        logout,
        completeOnboarding,
        getUserByUsername,
      }}>
      {children}
    </DevCircleContext.Provider>
  );
};

export const useDevCircle = (): DevCircleContextType => {
  const context = useContext(DevCircleContext);
  if (!context) {
    throw new Error('useDevCircle must be used within a DevCircleProvider');
  }
  return context;
};
