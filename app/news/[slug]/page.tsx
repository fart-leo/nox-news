import { prisma } from '../../../lib/db'
import { notFound } from 'next/navigation'

export const revalidate = 300

export default async function ArticlePage({ params }) {
  const article = await prisma.article.findUnique({ where: { slug: params.slug } })
  if (!article) return notFound()
  return (
    <article className="prose prose-invert">
      <h1>{article.title}</h1>
      <p>{article.source} • {article.publishedAt.toLocaleString()}</p>
      {article.summary && <p>{article.summary}</p>}
      <a href={article.url} className="underline" target="_blank">Читать оригинал</a>
    </article>
  )
}