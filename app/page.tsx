import { prisma } from '../lib/db'

export const revalidate = 300

export default async function Home() {
  const articles = await prisma.article.findMany({ orderBy: { publishedAt: 'desc' }, take: 20 })
  return (
    <div className="space-y-4">
      {articles.map(a => (
        <article key={a.id} className="p-4 border border-white/10 rounded-lg">
          <h2 className="font-semibold text-lg">{a.title}</h2>
          <p className="text-sm text-gray-400">{a.source} • {a.publishedAt.toLocaleString()}</p>
          <p>{a.summary}</p>
          <a href={a.url} className="underline text-blue-400" target="_blank">Оригинал</a>
        </article>
      ))}
    </div>
  )
}