import Image from 'next/image';
import Link from 'next/link';
import { defineQuery, PortableText } from 'next-sanity';
import type { PortableTextComponents } from 'next-sanity';
import { client } from '@/sanity/client';
import { urlFor } from '@/sanity/image';
import NavBar from '../../components/NavBar';
import ShareButton from './ShareButton';
import LaTeXFormula from '@/components/LaTeXFormula';
import { CalloutRenderer } from '@/components/callouts/CalloutRenderer';
import CalculatorLinkCard from '@/components/CalculatorLinkCard';

type BlogPost = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  publishedAt?: string;
  authorName?: string;
  authorImage?: unknown;
  categories?: string[];
  mainImage?: unknown;
  body?: unknown;
  excerpt?: string;
};

type RelatedPost = {
  _id: string;
  title?: string;
  slug?: { current?: string };
  publishedAt?: string;
  categories?: string[];
  mainImageUrl?: string;
  excerpt?: string;
};

const POST_QUERY = defineQuery(`*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  publishedAt,
  "authorName": coalesce(author->name, "BoltCalcPro Editorial"),
  "authorImage": author->image,
  "categories": array::compact(categories[]->title),
  mainImage,
  body,
  "excerpt": pt::text(body)
}`);

const RELATED_POSTS_QUERY =
  defineQuery(`*[_type == "post" && defined(slug.current) && slug.current != $slug] | order(publishedAt desc)[0...6]{
  _id,
  title,
  slug,
  publishedAt,
  "categories": categories[]->title,
  "mainImageUrl": mainImage.asset->url,
  "excerpt": pt::text(body)
}`);

function formatDate(date?: string) {
  if (!date) return '';

  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function getReadingTime(text?: string) {
  if (!text) return '5 min';

  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const averageWpm = 250;
  const minutes = Math.max(1, Math.ceil(words / averageWpm));
  return `${minutes} min`;
}

function truncate(text?: string, maxLength = 120) {
  if (!text)
    return 'New technical guidance and practical analysis from the BoltCalcPro editorial team.';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}...`;
}

function getCategoryLabel(post: BlogPost | RelatedPost) {
  return post.categories?.[0] || 'Technical Analysis';
}

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }: { value?: any }) => {
      if (!value?.asset?._ref) return null;

      return (
        <figure className="my-10">
          <Image
            src={urlFor(value).width(1200).auto('format').url()}
            alt={value.alt || ''}
            width={1200}
            height={675}
            className="w-full rounded-lg border border-slate-200 shadow-sm"
          />
          {value?.caption && (
            <figcaption className="mt-3 text-center text-sm italic text-slate-500">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    latexFormula: ({ value }: { value?: any }) => {
      if (!value?.code) return null;
      return (
        <LaTeXFormula
          code={value.code}
          displayMode={value.displayMode || 'inline'}
          alt={value.alt}
        />
      );
    },
    callout: ({ value }: { value?: any }) => {
      return <CalloutRenderer value={value} />;
    },
    calculatorLink: ({ value }: { value?: any }) => {
      return (
        <CalculatorLinkCard
          message={value?.message}
          buttonText={value?.buttonText}
        />
      );
    },
  },
  block: {
    normal: ({ children }) => (
      <p className="mb-6 text-base leading-8 text-slate-800">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-10 text-2xl font-semibold tracking-tight text-slate-900">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-8 text-xl font-semibold tracking-tight text-slate-900">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-4 border-blue-600 dark:border-blue-500 bg-slate-50 dark:bg-slate-800 px-6 py-4 text-slate-800 dark:text-slate-50">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        className="font-medium text-blue-600 dark:text-blue-400 underline decoration-blue-200 dark:decoration-blue-700 underline-offset-4 transition-colors hover:text-blue-700 dark:hover:text-blue-300"
      >
        {children}
      </a>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-6 ml-6 list-disc space-y-3 text-slate-800 dark:text-slate-50">
        {children}
      </ul>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-1 leading-7">{children}</li>,
  },
};

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, relatedPosts] = await Promise.all([
    client.fetch<BlogPost>(POST_QUERY, { slug }, { next: { revalidate: 30 } }),
    client.fetch<RelatedPost[]>(
      RELATED_POSTS_QUERY,
      { slug },
      { next: { revalidate: 30 } },
    ),
  ]);

  const categories = post?.categories?.length
    ? post.categories
    : ['Technical Analysis'];
  const readingTime = getReadingTime(post?.excerpt);
  const heroImageUrl = post?.mainImage
    ? urlFor(post.mainImage as never)
        .width(1400)
        .height(800)
        .auto('format')
        .url()
    : 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1400&q=80';
  const authorImageUrl = post?.authorImage
    ? urlFor(post.authorImage as never)
        .width(96)
        .height(96)
        .auto('format')
        .url()
    : 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80';

  const related = relatedPosts
    .filter((item) => item._id !== post?._id)
    .filter((item) =>
      item.categories?.some((category) => categories.includes(category || '')),
    )
    .slice(0, 3);

  const fallbackRelated =
    related.length > 0 ? related : relatedPosts.slice(0, 3);

  return (
    <div className="min-h-screen bg-background-light text-slate-900 dark:bg-background-dark dark:text-slate-100">
      <NavBar />

      <main
        id="article"
        className="mx-auto min-h-screen max-w-4xl bg-white dark:bg-slate-900 px-6 py-10"
      >
        <div className="mb-10 flex items-start justify-between gap-6 flex-wrap">
          <Link
            href="/blogs"
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.08em] text-primary dark:text-blue-400 transition-colors hover:underline"
          >
            <span className="material-symbols-outlined text-[18px]">
              arrow_back
            </span>
            Back to Blog
          </Link>
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <span
                key={category}
                className={`border px-2 py-1 text-[11px] font-bold uppercase tracking-[0.05em] transition-colors ${
                  index === 0
                    ? 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                    : 'border-primary dark:border-blue-500 bg-blue-100 dark:bg-blue-950 text-slate-900 dark:text-blue-200'
                }`}
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        <header className="mb-12" id="article-header">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-on-surface dark:text-slate-100 md:text-[32px]">
            {post?.title || 'Untitled post'}
          </h1>

          <div className="flex flex-col gap-6 border-y border-slate-100 dark:border-slate-800 py-6 md:flex-row md:items-center md:gap-6">
            <div className="flex items-center gap-3">
              <Image
                alt={post?.authorName || 'Author'}
                className="h-12 w-12 rounded-full object-cover"
                src={authorImageUrl}
                width={48}
                height={48}
              />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-slate-900 dark:text-slate-100">
                  {post?.authorName || 'BoltCalcPro Editorial'}
                </p>
              </div>
            </div>

            <div className="hidden h-10 w-px bg-slate-200 dark:bg-slate-800 md:block" />

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-slate-700 dark:text-slate-300">
                Published
              </p>
              <p className="text-sm text-slate-900 dark:text-slate-100">
                {formatDate(post?.publishedAt) || 'Draft'}
              </p>
            </div>

            <div className="hidden h-10 w-px bg-slate-200 dark:bg-slate-800 md:block" />

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.05em] text-slate-700 dark:text-slate-300">
                Read Time
              </p>
              <p className="text-sm text-slate-900 dark:text-slate-100">
                {readingTime}
              </p>
            </div>
          </div>
        </header>

        <section className="mb-12">
          <div className="overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-slate-950/50">
            <Image
              src={heroImageUrl}
              alt={post?.title || 'Main blog image'}
              width={1400}
              height={800}
              priority
              className="h-100 w-full object-cover"
            />
          </div>
        </section>

        <article className="space-y-8">
          <section>
            <div className="prose prose-slate dark:prose-invert max-w-none dark:[&_p]:text-slate-50 dark:[&_li]:text-slate-50 dark:[&_h2]:text-slate-50 dark:[&_h3]:text-slate-50 dark:[&_h4]:text-slate-50 dark:[&_strong]:text-slate-50 dark:[&_em]:text-slate-50">
              {post?.body ? (
                <PortableText
                  value={post.body as never}
                  components={portableTextComponents}
                />
              ) : (
                <p className="text-base leading-8 text-slate-700 dark:text-slate-50">
                  No article content is available for this post yet.
                </p>
              )}
            </div>
          </section>

          {/* <section className="bg-surface-container-low border-l-4 border-primary p-8">
            <h3 className="mb-4 text-xl font-semibold text-primary">
              Core Mathematical Model
            </h3>
            <p className="mb-6 inline-block border border-outline-variant bg-white p-4 font-mono text-lg text-on-surface">
              T = K · D · P
            </p>
            <ul className="space-y-3">
              <li className="flex gap-3 text-base leading-7 text-on-surface">
                <span className="w-4 font-bold text-primary">T:</span> Torque
                required to achieve desired preload.
              </li>
              <li className="flex gap-3 text-base leading-7 text-on-surface">
                <span className="w-4 font-bold text-primary">K:</span>{' '}
                Dimensionless torque coefficient.
              </li>
              <li className="flex gap-3 text-base leading-7 text-on-surface">
                <span className="w-4 font-bold text-primary">D:</span> Nominal
                diameter of the fastener.
              </li>
              <li className="flex gap-3 text-base leading-7 text-on-surface">
                <span className="w-4 font-bold text-primary">P:</span> Target
                axial preload.
              </li>
            </ul>
          </section> */}

          {/* <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-on-surface">
              Coefficient Comparison Matrix
            </h2>
            <div className="overflow-x-auto border border-outline-variant">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-outline-variant bg-surface-container text-on-surface">
                  <tr>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.05em]">
                      Material / Finish
                    </th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.05em]">
                      Static K
                    </th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.05em]">
                      Dynamic K
                    </th>
                    <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-[0.05em]">
                      Variance %
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[
                    ['Zinc Plate (Dry)', '0.20', '0.18', '±12%', 'text-error'],
                    ['Black Oxide', '0.18', '0.16', '±15%', 'text-error'],
                    ['Cadmium Plate', '0.13', '0.11', '±5%', 'text-primary'],
                    ['MoS2 Lubricated', '0.10', '0.09', '±3%', 'text-primary'],
                  ].map(
                    ([label, staticK, dynamicK, variance, varianceClass]) => (
                      <tr key={label} className="hover:bg-surface-bright">
                        <td className="px-4 py-3 font-bold text-on-surface">
                          {label}
                        </td>
                        <td className="px-4 py-3 text-on-surface">{staticK}</td>
                        <td className="px-4 py-3 text-on-surface">
                          {dynamicK}
                        </td>
                        <td className={`px-4 py-3 ${varianceClass}`}>
                          {variance}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </section> */}

          {/* <section>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-on-surface">
              Key Takeaways for Field Engineers
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="border border-slate-200 bg-white p-6">
                <div className="mb-4 flex items-center gap-3 text-primary">
                  <span className="material-symbols-outlined">verified</span>
                  <h4 className="text-xl font-semibold">
                    Pre-Calculation Audit
                  </h4>
                </div>
                <p className="text-sm leading-7 text-secondary">
                  Always verify the lubrication state of fasteners upon
                  delivery. Surface condition can shift the torque coefficient
                  significantly.
                </p>
              </div>

              <div className="border border-slate-200 bg-white p-6">
                <div className="mb-4 flex items-center gap-3 text-primary">
                  <span className="material-symbols-outlined">
                    monitor_heart
                  </span>
                  <h4 className="text-xl font-semibold">
                    Real-time Monitoring
                  </h4>
                </div>
                <p className="text-sm leading-7 text-secondary">
                  Use ultrasonic preload measurement where possible to bypass
                  the torque coefficient and measure elongation directly.
                </p>
              </div>
            </div>
          </section> */}
        </article>

        <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 pt-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex flex-wrap items-center gap-4">
              {/* <button
                type="button"
                className="flex items-center gap-2 border border-outline-variant bg-surface-container px-4 py-2 text-on-surface transition-colors hover:bg-surface-variant"
              >
                <span className="material-symbols-outlined">thumb_up</span>
                <span className="text-[11px] font-bold uppercase tracking-[0.05em]">
                  Helpful (124)
                </span>
              </button> */}
              <ShareButton />
            </div>

            <div className="flex gap-4">
              <a
                className="text-secondary dark:text-slate-400 transition-colors hover:text-primary dark:hover:text-blue-400"
                href="#"
              >
                <span className="material-symbols-outlined">bookmark</span>
              </a>
              <a
                className="text-secondary dark:text-slate-400 transition-colors hover:text-primary dark:hover:text-blue-400"
                href="#"
              >
                <span className="material-symbols-outlined">flag</span>
              </a>
            </div>
          </div>

          <div className="mt-16">
            <h3 className="mb-8 border-b dark:border-slate-800 pb-2 text-[11px] font-bold uppercase tracking-[0.05em] text-slate-700 dark:text-slate-300">
              Recommended Reading
            </h3>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {fallbackRelated.slice(0, 3).map((item, index) => {
                const relatedImage =
                  item.mainImageUrl ||
                  [
                    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80',
                    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80',
                  ][index % 3];

                return index === 0 ? (
                  <Link
                    key={item._id}
                    href={`/blogs/${item.slug?.current || ''}`}
                    className="group md:col-span-2"
                  >
                    <div className="relative mb-4 aspect-video overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
                      <Image
                        alt={item.title || 'Next article'}
                        className="object-cover transition-transform group-hover:scale-105"
                        src={relatedImage}
                        fill
                        sizes="(min-width: 768px) 66vw, 100vw"
                      />
                    </div>
                    <span className="mb-2 block text-[11px] font-bold uppercase tracking-[0.05em] text-primary dark:text-blue-400">
                      {getCategoryLabel(item)}
                    </span>
                    <h4 className="mb-2 text-xl font-semibold transition-colors group-hover:text-primary dark:text-slate-100 dark:group-hover:text-blue-400">
                      {item.title || 'Related technical article'}
                    </h4>
                    <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
                      {truncate(item.excerpt)}
                    </p>
                  </Link>
                ) : (
                  <Link
                    key={item._id}
                    href={`/blogs/${item.slug?.current || ''}`}
                    className="group cursor-pointer"
                  >
                    <h4 className="mb-2 text-base font-bold transition-colors group-hover:text-primary dark:text-slate-100 dark:group-hover:text-blue-400">
                      {item.title || 'Related technical article'}
                    </h4>
                    <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
                      {truncate(item.excerpt, 90)}
                    </p>
                    <span className="mt-2 block text-[10px] font-bold text-slate-400 dark:text-slate-500">
                      {getReadingTime(item.excerpt).toUpperCase()} READ
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
