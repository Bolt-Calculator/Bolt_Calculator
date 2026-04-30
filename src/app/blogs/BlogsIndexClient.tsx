'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { defineQuery } from 'next-sanity';
import { client } from '@/sanity/client';
import Dashboard from '../components/Dashboard';
import NavBar from '../components/NavBar';
import { useResult } from '../context/ResultContext';

type BlogPost = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  publishedAt?: string;
  authorName?: string;
  authorImageUrl?: string;
  mainImageUrl?: string;
  categories?: string[];
  excerpt?: string;
};

type BlogsIndexClientProps = {
  initialPosts?: BlogPost[];
};

const POSTS_QUERY = defineQuery(
  `*[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...48]{
    _id,
    title,
    slug,
    publishedAt,
    "authorName": coalesce(author->name, "BoltCalcPro Editorial"),
    "authorImageUrl": author->image.asset->url,
    "mainImageUrl": mainImage.asset->url,
    "categories": categories[]->title,
    "excerpt": pt::text(body)
  }`,
);

const POSTS_PER_PAGE = 6;

const cardPlaceholders = [
  'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1581093196277-1c8ddf7f7b7d?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1400&q=80',
  'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1400&q=80',
];

function formatDate(date?: string) {
  if (!date) return 'Draft';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

function getShortExcerpt(text?: string) {
  if (!text) {
    return 'Practical engineering insights for fastener design and structural reliability.';
  }

  const trimmed = text.trim();
  if (trimmed.length <= 120) return trimmed;
  return `${trimmed.slice(0, 117).trimEnd()}...`;
}

export default function BlogsIndexClient({
  initialPosts = [],
}: BlogsIndexClientProps) {
  const { isMobileMenuOpen, setIsMobileMenuOpen } = useResult();
  const [currentPage, setCurrentPage] = useState(1);
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(initialPosts.length === 0);

  useEffect(() => {
    if (initialPosts.length > 0) return;

    let isMounted = true;

    async function loadPosts() {
      try {
        const fetchedPosts = await client.fetch<BlogPost[]>(
          POSTS_QUERY,
          {},
          { next: { revalidate: 30 } },
        );
        if (isMounted) {
          setPosts(fetchedPosts || []);
        }
      } catch {
        if (isMounted) {
          setPosts([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, [initialPosts]);

  const filteredPosts = useMemo(() => {
    return posts;
  }, [posts]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPosts.length / POSTS_PER_PAGE),
  );

  const visiblePosts = useMemo(() => {
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    return filteredPosts.slice(start, start + POSTS_PER_PAGE);
  }, [currentPage, filteredPosts]);

  const pagesToRender = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const first = 1;
    const last = totalPages;
    const previous = Math.max(first + 1, currentPage - 1);
    const next = Math.min(last - 1, currentPage + 1);

    const pages = new Set<number>([first, previous, currentPage, next, last]);
    return Array.from(pages)
      .filter((page) => page >= first && page <= last)
      .sort((a, b) => a - b);
  }, [currentPage, totalPages]);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex flex-col fixed inset-0 m-0 p-0 overflow-hidden">
      <NavBar />

      <div className="flex flex-row flex-1 min-h-0 p-0 m-0">
        <aside className="hidden lg:flex lg:w-64 border-r border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex-col overflow-y-auto">
          <Dashboard />
        </aside>

        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <aside className="relative w-64 h-full bg-surface-light dark:bg-surface-dark flex flex-col overflow-y-auto">
              <Dashboard />
            </aside>
          </div>
        )}

        <main className="flex-1 flex flex-col min-w-0 overflow-y-auto scrollbar-hide">
          <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 md:p-8">
            <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h1 className="mb-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
                  Technical Journal
                </h1>
                <p className="max-w-2xl text-sm text-slate-500 dark:text-slate-400 sm:text-base">
                  Engineering insights, simulation best practices, and detailed
                  analysis of structural fastening technologies.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {isLoading && (
                <div className="col-span-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                  Loading publications...
                </div>
              )}

              {visiblePosts.map((post, index) => (
                <article
                  key={post._id}
                  className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-shadow hover:shadow-lg dark:hover:shadow-slate-950/50"
                >
                  <div className="relative h-48">
                    <Image
                      src={
                        post.mainImageUrl ||
                        cardPlaceholders[(index + 2) % cardPlaceholders.length]
                      }
                      alt={post.title || 'Blog post image'}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex grow flex-col p-6">
                    <h3 className="mb-2 text-xl font-semibold text-slate-900 dark:text-slate-100 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
                      <Link href={`/blogs/${post.slug?.current || ''}`}>
                        {post.title || 'Untitled post'}
                      </Link>
                    </h3>

                    <p className="mb-6 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                      {getShortExcerpt(post.excerpt)}
                    </p>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                          <Image
                            src={
                              post.authorImageUrl ||
                              cardPlaceholders[
                                (index + 3) % cardPlaceholders.length
                              ]
                            }
                            alt={post.authorName || 'Author'}
                            width={32}
                            height={32}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-sm leading-none font-semibold text-slate-900 dark:text-slate-100">
                            {post.authorName || 'BoltCalcPro Team'}
                          </p>
                          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                            {formatDate(post.publishedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-10 text-center text-slate-500 dark:text-slate-400">
                No publications matched your filters.
              </div>
            )}

            <div className="mb-8 mt-12 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-400 transition-colors hover:border-blue-600 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Previous page"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>

              {pagesToRender.map((page, index) => {
                const previous = pagesToRender[index - 1];
                const showEllipsis = previous && page - previous > 1;

                return (
                  <div key={page} className="flex items-center gap-2">
                    {showEllipsis && (
                      <span className="px-1 text-slate-400">...</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setCurrentPage(page)}
                      className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                        currentPage === page
                          ? 'bg-blue-600 text-white dark:bg-blue-600 dark:text-white'
                          : 'border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400'
                      }`}
                    >
                      {page}
                    </button>
                  </div>
                );
              })}

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                disabled={currentPage === totalPages}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 transition-colors hover:border-blue-600 hover:text-blue-600 dark:hover:border-blue-500 dark:hover:text-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Next page"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
