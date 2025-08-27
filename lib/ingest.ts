import Parser from 'rss-parser'
import crypto from 'node:crypto'
import slugify from 'slugify'
import { prisma } from '../lib/db'
import { RSS_FEEDS } from '../lib/feeds'

function urlHash(url: string) {
  return crypto.createHash('sha256').update(url).digest('hex')
}

function toSlug(title: string) {
  return slugify(title, { lower: true, strict: true }) + '-' + Math.random().toString(36).slice(2,7)
}

// Санитайзер для кривых & в XML
function sanitizeXml(xml: string) {
  return xml.replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;|#x[a-fA-F0-9]+;)/g, '&amp;')
}

export async function ingestRSS() {
  const parser = new Parser()
  let saved = 0

  for (const feed of RSS_FEEDS) {
    try {
      // Грузим сами, чтобы поправить XML перед парсингом
      const res = await fetch(feed.url, { headers: { 'user-agent': 'NOX/1.0 (+https://example.com)' } })
      const raw = await res.text()
      const safe = sanitizeXml(raw)

      const parsed = await parser.parseString(safe)
      for (const it of parsed.items ?? []) {
        const title = it.title?.trim()
        const link = it.link?.trim()
        if (!title || !link) continue

        const h = urlHash(link)
        const exists = await prisma.article.findFirst({ where: { OR: [{ url: link }, { urlHash: h }] } })
        if (exists) continue

        const pub = new Date((it as any).isoDate || (it as any).pubDate || Date.now())
        const snippet = (it as any).contentSnippet || (it as any).content || ''
        const summary = snippet.replace(/<[^>]+>/g,'').slice(0, 500)
        const imageUrl = (it as any).enclosure?.url ?? null

        await prisma.article.create({
          data: {
            title,
            slug: toSlug(title),
            url: link,
            urlHash: h,
            source: feed.name,
            summary,
            content: null,
            imageUrl,
            tags: "",            // у нас поле String
            publishedAt: pub,
          }
        })
        saved++
      }
    } catch (e) {
      console.warn('Feed failed, skip:', feed.name, e)
      // Просто пропускаем проблемный фид
      continue
    }
  }

  return { saved }
}
