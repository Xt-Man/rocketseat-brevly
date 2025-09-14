import { faker } from '@faker-js/faker'
import type { urlInterface } from '@/app/functions/interface/url'
import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'

export function generateFakeUrl() {
  return {
    id: faker.string.uuid(),
    originalUrl: faker.internet.url(),
    shortenedUrl: faker.string.alphanumeric(10),
    accessCount: faker.number.int({ min: 0, max: 9999 }),
    createdAt: faker.date.recent(),
  }
}

export async function seedUrls(count = 1): Promise<urlInterface[]> {
  const urls = Array.from({ length: count }, generateFakeUrl)

  return await db
    .insert(schema.urls)
    .values(
      urls.map(item => ({
        originalUrl: item.originalUrl,
        shortenedUrl: item.shortenedUrl,
        accessCount: item.accessCount,
        createdAt: item.createdAt,
        id: item.id,
      }))
    )
    .returning({
      id: schema.urls.id,
      shortenedUrl: schema.urls.shortenedUrl,
      originalUrl: schema.urls.originalUrl,
      accessCount: schema.urls.accessCount,
      createdAt: schema.urls.createdAt,
    })
}
