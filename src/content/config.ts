import { defineCollection, z } from "astro:content";

const services = defineCollection({
  type: "content",
  schema: z.object({
    id: z.string(),
    num: z.string(),
    title: z.string(),
    icon: z.string(),
    tag: z.string().optional(),
    short: z.string(),
    long: z.string().optional(),
    facts: z.array(z.object({ k: z.string(), v: z.string() })).optional(),
    order: z.number().optional(),
  }),
});

const projects = defineCollection({
  type: "content",
  schema: z.object({
    id: z.string(),
    title: z.string(),
    kind: z.string(),
    year: z.number(),
    lang: z.string(),
    tags: z.array(z.string()).default([]),
    desc: z.string().optional(),
    seed: z.number().default(1),
    dur: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().optional(),
  }),
});

const posts = defineCollection({
  type: "content",
  schema: z.object({
    id: z.string(),
    tag: z.string(),
    title: z.string(),
    date: z.string(),
    excerpt: z.string(),
    read: z.string(),
    order: z.number().optional(),
  }),
});

const studios = defineCollection({
  type: "content",
  schema: z.object({
    id: z.string(),
    name: z.string(),
    spec: z.string(),
    equip: z.array(z.string()).default([]),
    surface: z.string().optional(),
    rt60: z.string().optional(),
    order: z.number().optional(),
  }),
});

const faq = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    items: z.array(z.object({ q: z.string(), a: z.string() })),
    order: z.number().optional(),
  }),
});

export const collections = { services, projects, posts, studios, faq };
