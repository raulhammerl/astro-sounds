import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    pubDate: z.coerce.date(),
    author: z.string().default('Raul'),
    youtubeId: z.string().optional(),
    soundcloudUrl: z.string().optional(),
  }),
});

export const collections = { blog };
