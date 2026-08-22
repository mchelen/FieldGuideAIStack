import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Every factual claim about a real product, license, or service carries its own
 * source. `verifiedOn` is the date a human or agent actually opened the URL --
 * not the date the claim was written. See AGENTS.md.
 */
const source = z.object({
  url: z.string().url(),
  title: z.string().min(1),
  verifiedOn: z.coerce.date(),
  // Provenance caveats -- e.g. "publisher blocks automated fetchers; read with
  // a browser user-agent". Surfaced on the page so readers can judge the claim.
  note: z.string().optional(),
});

/**
 * Relation vocabulary. Deliberately small: a distinction only earns a new
 * relation type when an existing one would misdescribe it.
 *
 * `inverse` drives the derived reverse edges -- nothing in content/ ever
 * authors a back-edge by hand.
 */
export const RELATION_TYPES = {
  'part-of': { label: 'is part of', inverse: 'contains' },
  contains: { label: 'contains', inverse: 'part-of' },
  'distinguished-from': { label: 'is often confused with', inverse: 'distinguished-from' },
  consumes: { label: 'consumes', inverse: 'consumed-by' },
  'consumed-by': { label: 'is consumed by', inverse: 'consumes' },
  implements: { label: 'implements', inverse: 'implemented-by' },
  'implemented-by': { label: 'is implemented by', inverse: 'implements' },
  'kind-of': { label: 'is a kind of', inverse: 'has-kind' },
  'has-kind': { label: 'has kind', inverse: 'kind-of' },
  'runs-on': { label: 'runs on', inverse: 'hosts' },
  hosts: { label: 'hosts', inverse: 'runs-on' },
} as const;

export type RelationType = keyof typeof RELATION_TYPES;

const relationType = z.enum(
  Object.keys(RELATION_TYPES) as [RelationType, ...RelationType[]],
);

/**
 * Zoom levels. A node declares the coarsest level at which it should appear,
 * so the overview graph can thin itself out without a separate curated list.
 *   1 = the handful of terms someone needs on day one
 *   2 = the working vocabulary
 *   3 = detail you look up when you hit it
 */
const zoom = z.union([z.literal(1), z.literal(2), z.literal(3)]);

const nodes = defineCollection({
  loader: glob({ base: './src/content/nodes', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().min(1),
    aka: z.array(z.string()).default([]),
    tags: z.array(z.string()).min(1),
    zoom: zoom.default(2),
    // One sentence. Shown on cards, in graph tooltips, and in search results.
    summary: z.string().min(1).max(320),
    // "If you see this in the wild, here is how you know" -- the field-guide
    // spotting note. Optional; not every concept has a tell.
    fieldMark: z.string().max(320).optional(),
    relations: z
      .array(
        z.object({
          type: relationType,
          // reference() makes a dangling edge a build failure, not a review catch.
          target: reference('nodes'),
          note: z.string().optional(),
        }),
      )
      .default([]),
    examples: z
      .array(
        z.object({
          name: z.string().min(1),
          vendor: z.string().optional(),
          url: z.string().url(),
          note: z.string().optional(),
          verifiedOn: z.coerce.date(),
        }),
      )
      .default([]),
    sources: z.array(source).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { nodes };
