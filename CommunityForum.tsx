import { useState } from 'react';
import { MessageSquare, ThumbsUp, Reply, Clock, ChevronRight, ChevronDown, Plus, Search, TrendingUp, Pin } from 'lucide-react';

interface ForumThread {
  id: string;
  title: string;
  author: string;
  authorInitials: string;
  category: string;
  replies: number;
  likes: number;
  timestamp: string;
  preview: string;
  isPinned?: boolean;
  isHot?: boolean;
  posts: ForumPost[];
}

interface ForumPost {
  id: string;
  author: string;
  authorInitials: string;
  content: string;
  timestamp: string;
  likes: number;
}

const categories = ['All', 'Data Queries', 'Churn Models', 'Integrations', 'General'];

const mockThreads: ForumThread[] = [
  {
    id: 't1',
    title: 'Best SQL query pattern for calculating rolling churn rates?',
    author: 'Sarah Chen',
    authorInitials: 'SC',
    category: 'Data Queries',
    replies: 12,
    likes: 34,
    timestamp: '2 hours ago',
    isPinned: true,
    isHot: true,
    preview: "I'm trying to build a rolling 30-day churn rate using window functions but getting unexpected results when customers have gaps in their activity logs...",
    posts: [
      {
        id: 'p1',
        author: 'Sarah Chen',
        authorInitials: 'SC',
        content: "I'm trying to build a rolling 30-day churn rate using window functions but getting unexpected results when customers have gaps in their activity logs. Has anyone solved this with a CTE approach?",
        timestamp: '2 hours ago',
        likes: 8,
      },
      {
        id: 'p2',
        author: 'Marcus Webb',
        authorInitials: 'MW',
        content: "We handled this by first filling activity gaps with a generate_series CTE, then applying the window function on the continuous series. The key is to treat 'no activity' as a signal, not a gap. I can share our query if you'd like.",
        timestamp: '1 hour ago',
        likes: 15,
      },
      {
        id: 'p3',
        author: 'Sarah Chen',
        authorInitials: 'SC',
        content: "That would be incredibly helpful! The generate_series approach makes sense — I was trying to work around the gaps instead of filling them first.",
        timestamp: '45 min ago',
        likes: 3,
      },
      {
        id: 'p4',
        author: 'Priya Nair',
        authorInitials: 'PN',
        content: "We do something similar but also weight the inactivity by plan tier. Enterprise customers get a longer grace period before being flagged. Works really well in practice.",
        timestamp: '30 min ago',
        likes: 11,
      },
    ],
  },
  {
    id: 't2',
    title: 'Integrating AuraPredict churn scores with Salesforce CRM',
    author: 'David Park',
    authorInitials: 'DP',
    category: 'Integrations',
    replies: 7,
    likes: 21,
    timestamp: '5 hours ago',
    preview: "Looking for best practices on syncing churn risk scores from AuraPredict into Salesforce custom fields. Has anyone set up a scheduled pipeline for this?",
    posts: [
      {
        id: 'p5',
        author: 'David Park',
        authorInitials: 'DP',
        content: "Looking for best practices on syncing churn risk scores from AuraPredict into Salesforce custom fields. Has anyone set up a scheduled pipeline for this?",
        timestamp: '5 hours ago',
        likes: 4,
      },
      {
        id: 'p6',
        author: 'Elena Rodriguez',
        authorInitials: 'ER',
        content: "We built a nightly batch job that exports scores to a CSV, then uses Salesforce's Data Loader CLI to upsert into a custom object. Simple and reliable. For real-time, you'd need the REST API.",
        timestamp: '3 hours ago',
        likes: 9,
      },
    ],
  },
  {
    id: 't3',
    title: 'Feature request: cohort-based churn benchmarking',
    author: 'Alex Kim',
    authorInitials: 'AK',
    category: 'Churn Models',
    replies: 4,
    likes: 18,
    timestamp: '1 day ago',
    preview: "It would be great to compare individual customer churn scores against their cohort baseline rather than an absolute threshold. Different signup cohorts have different risk profiles...",
    posts: [
      {
        id: 'p7',
        author: 'Alex Kim',
        authorInitials: 'AK',
        content: "It would be great to compare individual customer churn scores against their cohort baseline rather than an absolute threshold. Different signup cohorts have different risk profiles and a score of 50 means different things for a 2-year customer vs a 2-month one.",
        timestamp: '1 day ago',
        likes: 12,
      },
      {
        id: 'p8',
        author: 'James Donnelly',
        authorInitials: 'JD',
        content: "Great point. We're exploring relative scoring in the next model version. Cohort normalization is on the roadmap for Q1. Would you prefer percentile-based or z-score normalization?",
        timestamp: '20 hours ago',
        likes: 6,
      },
    ],
  },
  {
    id: 't4',
    title: 'Handling NULL values in CSV uploads — what works best?',
    author: 'Nina Patel',
    authorInitials: 'NP',
    category: 'Data Queries',
    replies: 9,
    likes: 27,
    timestamp: '1 day ago',
    isHot: true,
    preview: "I have CSV files with lots of NULL fields and the auto-clean sometimes fills values that don't make sense for my dataset. Anyone have tips for configuring the fill strategy?",
    posts: [
      {
        id: 'p9',
        author: 'Nina Patel',
        authorInitials: 'NP',
        content: "I have CSV files with lots of NULL fields and the auto-clean sometimes fills values that don't make sense for my dataset. Anyone have tips for configuring the fill strategy?",
        timestamp: '1 day ago',
        likes: 7,
      },
      {
        id: 'p10',
        author: 'Marcus Webb',
        authorInitials: 'MW',
        content: "We pre-process our CSVs with a Python script that uses domain-specific defaults before uploading. For example, if last_login is NULL, we set it to the account creation date + 7 days rather than letting the auto-clean guess.",
        timestamp: '22 hours ago',
        likes: 14,
      },
    ],
  },
  {
    id: 't5',
    title: 'Welcome to the AuraPredict.AI Community Forum!',
    author: 'AuraPredict Team',
    authorInitials: 'AT',
    category: 'General',
    replies: 3,
    likes: 42,
    timestamp: '3 days ago',
    isPinned: true,
    preview: "Welcome developers! This is the place to share data queries, discuss churn modeling approaches, and help each other build better predictive analytics pipelines.",
    posts: [
      {
        id: 'p11',
        author: 'AuraPredict Team',
        authorInitials: 'AT',
        content: "Welcome developers! This is the place to share data queries, discuss churn modeling approaches, and help each other build better predictive analytics pipelines. Be respectful, share knowledge, and let's build something great together.",
        timestamp: '3 days ago',
        likes: 28,
      },
    ],
  },
];

const authorColors = [
  'bg-primary-500/15 text-primary-400 border-primary-500/20',
  'bg-accent-500/15 text-accent-400 border-accent-500/20',
  'bg-amber-500/15 text-amber-400 border-amber-500/20',
  'bg-red-500/15 text-red-400 border-red-500/20',
  'bg-ink-600/40 text-ink-200 border-ink-500',
];

function getAuthorColor(name: string): string {
  const idx = name.charCodeAt(0) % authorColors.length;
  return authorColors[idx];
}

export default function CommunityForum() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [expandedThread, setExpandedThread] = useState<string | null>(null);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [likedThreads, setLikedThreads] = useState<Set<string>>(new Set());

  const filteredThreads = mockThreads.filter((thread) => {
    const matchesCategory = activeCategory === 'All' || thread.category === activeCategory;
    const matchesSearch =
      !search.trim() ||
      thread.title.toLowerCase().includes(search.toLowerCase()) ||
      thread.preview.toLowerCase().includes(search.toLowerCase()) ||
      thread.author.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedThreads = [...filteredThreads].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const togglePostLike = (postId: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
  };

  const toggleThreadLike = (threadId: string) => {
    setLikedThreads((prev) => {
      const next = new Set(prev);
      if (next.has(threadId)) next.delete(threadId);
      else next.add(threadId);
      return next;
    });
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-ink-700/40">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500/10 border border-accent-500/20">
            <MessageSquare className="h-4.5 w-4.5 text-accent-400" strokeWidth={1.8} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Community Forum</h3>
            <p className="text-xs text-ink-400 mt-0.5">Developer discussions on data queries and churn modeling</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-lg border border-ink-700/60 bg-ink-850/60 px-3 py-2">
            <Search className="h-3.5 w-3.5 text-ink-400" strokeWidth={1.8} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search threads..."
              className="w-28 sm:w-36 bg-transparent text-sm text-ink-100 placeholder:text-ink-400 outline-none"
            />
          </div>
          <button className="flex items-center gap-1.5 rounded-lg bg-accent-500/10 border border-accent-500/20 px-3 py-2 text-xs font-semibold text-accent-400 hover:bg-accent-500/20 transition-colors">
            <Plus className="h-3.5 w-3.5" strokeWidth={1.8} />
            New Thread
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 px-5 py-3 border-b border-ink-700/40 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all duration-200 whitespace-nowrap ${
              activeCategory === cat
                ? 'bg-accent-500/15 text-accent-400 border-accent-500/30'
                : 'border-ink-700/40 text-ink-400 hover:text-ink-200 hover:border-ink-600'
            }`}
          >
            {cat}
          </button>
        ))}
        <span className="ml-auto text-xs font-mono text-ink-400 whitespace-nowrap">
          {sortedThreads.length} {sortedThreads.length === 1 ? 'thread' : 'threads'}
        </span>
      </div>

      <div className="divide-y divide-ink-700/30">
        {sortedThreads.map((thread) => {
          const isExpanded = expandedThread === thread.id;
          const threadLiked = likedThreads.has(thread.id);
          return (
            <div key={thread.id} className="transition-colors">
              <div
                onClick={() => setExpandedThread(isExpanded ? null : thread.id)}
                className="px-5 py-4 cursor-pointer hover:bg-ink-700/20 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-[10px] font-bold border ${getAuthorColor(thread.author)}`}>
                    {thread.authorInitials}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {thread.isPinned && (
                        <span className="flex items-center gap-1 rounded-md bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400">
                          <Pin className="h-2.5 w-2.5" strokeWidth={2} />
                          Pinned
                        </span>
                      )}
                      {thread.isHot && (
                        <span className="flex items-center gap-1 rounded-md bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-red-400">
                          <TrendingUp className="h-2.5 w-2.5" strokeWidth={2} />
                          Hot
                        </span>
                      )}
                      <span className="rounded-md bg-ink-700/50 border border-ink-600 px-1.5 py-0.5 text-[10px] font-medium text-ink-300">
                        {thread.category}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-ink-100 group-hover:text-white transition-colors">
                      {thread.title}
                    </p>
                    <p className="text-xs text-ink-400 mt-1 line-clamp-2 leading-relaxed">{thread.preview}</p>

                    <div className="flex items-center gap-4 mt-2 text-[11px] text-ink-400">
                      <span className="flex items-center gap-1">
                        <span className="text-ink-300">{thread.author}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Reply className="h-3 w-3" strokeWidth={1.8} />
                        {thread.replies}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleThreadLike(thread.id);
                        }}
                        className={`flex items-center gap-1 transition-colors ${threadLiked ? 'text-primary-400' : 'hover:text-ink-200'}`}
                      >
                        <ThumbsUp className="h-3 w-3" strokeWidth={1.8} />
                        {thread.likes + (threadLiked ? 1 : 0)}
                      </button>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" strokeWidth={1.8} />
                        {thread.timestamp}
                      </span>
                      <span className="ml-auto flex items-center text-ink-400">
                        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 pl-17 space-y-3 animate-fade-in" style={{ paddingLeft: '4.25rem' }}>
                  {thread.posts.map((post) => {
                    const postLiked = likedPosts.has(post.id);
                    return (
                      <div key={post.id} className="rounded-xl border border-ink-700/40 bg-ink-850/30 p-4">
                        <div className="flex items-start gap-3">
                          <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[10px] font-bold border ${getAuthorColor(post.author)}`}>
                            {post.authorInitials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-ink-100">{post.author}</span>
                              <span className="text-[11px] text-ink-400 flex items-center gap-1">
                                <Clock className="h-3 w-3" strokeWidth={1.8} />
                                {post.timestamp}
                              </span>
                            </div>
                            <p className="text-sm text-ink-300 leading-relaxed">{post.content}</p>
                            <div className="mt-3 flex items-center gap-3">
                              <button
                                onClick={() => togglePostLike(post.id)}
                                className={`flex items-center gap-1 text-xs transition-colors ${postLiked ? 'text-primary-400' : 'text-ink-400 hover:text-ink-200'}`}
                              >
                                <ThumbsUp className="h-3.5 w-3.5" strokeWidth={1.8} />
                                {post.likes + (postLiked ? 1 : 0)}
                              </button>
                              <button className="flex items-center gap-1 text-xs text-ink-400 hover:text-ink-200 transition-colors">
                                <Reply className="h-3.5 w-3.5" strokeWidth={1.8} />
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  <div className="flex items-center gap-2 rounded-lg border border-dashed border-ink-600 bg-ink-850/30 px-3.5 py-2.5 text-ink-400 hover:border-accent-500/40 hover:text-ink-200 transition-colors cursor-pointer">
                    <Plus className="h-4 w-4" strokeWidth={1.8} />
                    <span className="text-sm">Add a reply...</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {sortedThreads.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-8 w-8 text-ink-500 mb-3" strokeWidth={1.5} />
            <p className="text-sm text-ink-400">No threads match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
