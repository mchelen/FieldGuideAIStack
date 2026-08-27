import { defineCollection, reference, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

/**
 * Every factual claim about a real product, license, or service carries its own
 * source. `verifiedOn` is the date a human or agent actually opened the URL --
 * not the date the claim was written. See AGENTS.md.
 */
const source = z.object({
  /**
   * Stable handle for citing this source from prose as [[cite:id]]. Stable
   * rather than positional so reordering the list cannot silently repoint a
   * citation at a different reference.
   */
  id: z
    .string()
    .regex(/^[a-z0-9][a-z0-9-]*$/, 'source id must be lowercase kebab-case'),
  url: z.string().url(),
  title: z.string().min(1),
  verifiedOn: z.coerce.date(),
  /**
   * The sentence on the page that carries the claim, copied verbatim.
   *
   * Optional, and the only thing that makes a citation machine-re-verifiable:
   * `npm run draft:freshness` re-fetches the URL and will bump `verifiedOn`
   * only when it finds this text still there. Without it a script can confirm
   * that a URL resolves and nothing more, and bumping a date on that basis is
   * exactly the thing the rules forbid.
   *
   * Copy it; never paraphrase it. A quote that has been tidied will stop
   * matching a page that did not change.
   */
  quote: z.string().min(20).optional(),
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
  // Product -> concept. The spine of the comparison view: what a product
  // actually ships, as opposed to what it is marketed as.
  bundles: { label: 'bundles', inverse: 'bundled-by' },
  'bundled-by': { label: 'is bundled by', inverse: 'bundles' },
  // Product -> product, for a shared engine under different packaging.
  'variant-of': { label: 'is a variant of', inverse: 'has-variant' },
  'has-variant': { label: 'has variant', inverse: 'variant-of' },
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

/**
 * A vendor's name for a concept. A bare string is an informal synonym; the
 * object form is a claim that a named vendor calls it that, which is a product
 * claim and therefore needs a source and a date like any other.
 */
const alias = z.union([
  z.string(),
  z.object({
    term: z.string().min(1),
    usedBy: z.string().min(1),
    url: z.string().url(),
    verifiedOn: z.coerce.date(),
    note: z.string().optional(),
  }),
]);

/**
 * Whether a canonical term exists at all. The charter asks us to prefer
 * existing industry terms over invented ones, which makes "there isn't one"
 * a finding worth recording rather than a blank to leave empty.
 *   standard   — a standards body or specification defines it
 *   de-facto   — one organisation's term that the field adopted
 *   contested  — vendors use different words for the same thing
 *   none       — no settled term; the guide is picking one
 */
/**
 * `.strict()` because this block carries a `url` and a `verifiedOn` just like a
 * source does, so a key meant for a source lands here plausibly. Without it Zod
 * drops the stray key and every check stays green -- which is exactly how a
 * batch of `quote`s was silently written into canonical blocks and lost.
 */
const canonical = z
  .object({
    status: z.enum(['standard', 'de-facto', 'contested', 'none']),
    term: z.string().optional(),
    body: z.string().optional(),
    note: z.string().optional(),
    url: z.string().url().optional(),
    title: z.string().optional(),
    verifiedOn: z.coerce.date().optional(),
  })
  .strict();

/** The machines a request can be on, coarsest-useful first. */
export const WHERE = [
  'a person, not a system',
  'your machine',
  'wherever the product runs',
  'a bounded environment',
  'your infrastructure',
  'on the wire',
  "the provider's servers",
  "the host's own hardware",
  'inside one model call',
  'the weights file',
  'a training cluster',
  'the prompt you send',
  'your evaluation harness',
  "the vendor's cloud",
  'the open web',
  'what the reader sees',
  'your invoice',
  'a contract, not a computer',
  'nobody, at 3am',
] as const;

/** A concrete situation the concept shows up in. Generic for now. */
const useCase = z.object({
  scenario: z.string().min(1),
  detail: z.string().min(1),
});

/**
 * The applied illustration: one real request, traced through the pieces it
 * touches, with this concept marked as the station it passes through.
 *
 * A station is either a node in this graph -- in which case the diagram links
 * it and the validator checks it exists -- or a bare `actor`, for the parts of
 * a real system this guide has no page for: the person typing, the document,
 * the repository. Exactly one station carries `self: true`.
 *
 * `returns` is the payoff arrow: the short answer to "and what did that buy
 * you", drawn back up the diagram rather than as another step forward.
 */
const flowStation = z
  .object({
    node: reference('nodes').optional(),
    actor: z.string().min(1).max(40).optional(),
    does: z.string().min(1).max(90),
    self: z.boolean().default(false),
    /**
     * Whose computer this step happens on. Consecutive stations sharing one
     * answer are drawn inside a labelled band, so the moment a request leaves
     * the reader's machine is a line you can see rather than a fact you have
     * to already know. Either every station in a flow carries it or none do --
     * enforced by scripts/validate-graph.mjs, because a half-banded diagram
     * reads as though the unlabelled steps happen nowhere.
     *
     * A closed list, because a band is only worth drawing if it groups. The
     * first pass wrote whatever fitted each step and produced 187 different
     * answers, which meant 74 flows where every band held exactly one station
     * -- a boundary drawn between two steps on the same machine, and the
     * boundary that matters lost among them. Adding a place here should be a
     * deliberate decision that the guide has a machine it cannot yet name.
     */
    where: z.enum(WHERE).optional(),
  })
  .strict()
  .refine((s) => Boolean(s.node) !== Boolean(s.actor), {
    message: 'a station is either a `node` or an `actor`, never both and never neither',
  });

const flow = z
  .object({
    scenario: z.string().min(1).max(160),
    // Eight, not six. End to end means the person at one end and the thing
    // being reached at the other, and six ran out before both fitted.
    path: z.array(flowStation).min(3).max(8),
    returns: z.string().min(1).max(120).optional(),
  })
  .strict();

const nodes = defineCollection({
  loader: glob({ base: './src/content/nodes', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string().min(1),
    /**
     * Concepts are ideas; products are things you can buy or install; suites are
     * the families products are sold in. All three live in one graph so a
     * product can point straight at the concepts it ships and the family it
     * belongs to, which is what makes two products comparable without a
     * separate taxonomy.
     */
    kind: z.enum(['concept', 'product', 'suite']).default('concept'),
    /** Products only: who sells it. */
    vendor: z.string().optional(),
    aka: z.array(alias).default([]),
    canonical: canonical.optional(),
    useCase: useCase.optional(),
    flow: flow.optional(),
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
          /**
           * How completely this holds. "yes" and "yes, but only on the desktop
           * app" are different answers, and flattening them is how comparison
           * tables end up lying. Partial edges must carry a `note` saying what
           * the limit is -- enforced by scripts/validate-graph.mjs.
           */
          support: z.enum(['full', 'partial']).default('full'),
        }),
      )
      .default([]),
    examples: z
      .array(
        // Strict for the same reason as `canonical` above: url + verifiedOn
        // makes this look like a source to anything editing frontmatter.
        z
          .object({
            name: z.string().min(1),
            vendor: z.string().optional(),
            url: z.string().url(),
            note: z.string().optional(),
            verifiedOn: z.coerce.date(),
          })
          .strict(),
      )
      .default([]),
    sources: z.array(source).default([]),
    draft: z.boolean().default(false),
  }),
});

/**
 * Fieldwork: the fictional organisation the charter asks for, so concepts can
 * be shown happening to somebody rather than defined in the abstract.
 *
 * Deliberately a separate collection from `nodes`, and deliberately `.strict()`
 * with no `sources` field. Everything in `nodes` carries a dated source and is
 * checkable; everything here is invented. Keeping them in one collection would
 * mean one schema, one page template, and eventually a reader unable to tell
 * which claims were verified -- which would cost more than the fiction adds.
 * A `sources:` key in a scenario is a build failure, not a review catch.
 */
const scenarios = defineCollection({
  loader: glob({ base: './src/content/scenarios', pattern: '**/*.md' }),
  schema: z
    .object({
      title: z.string().min(1),
      /** Reading order on the fieldwork index. Not a difficulty ranking. */
      order: z.number().int().positive(),
      summary: z.string().min(1).max(320),
      /** Who in the organisation this happens to. */
      cast: z
        .array(
          z.object({
            name: z.string().min(1),
            role: z.string().min(1),
          }),
        )
        .min(1),
      /**
       * The concepts this episode makes concrete. At least two, because a
       * scenario illustrating one idea is a use case and belongs on the node
       * page instead -- the point of fieldwork is showing concepts interact.
       */
      concepts: z.array(reference('nodes')).min(2),
      /** What changed for them. The part a reader should remember. */
      outcome: z.string().min(1),
    })
    .strict(),
});

/**
 * The fictional organisation itself. One entry, loaded from YAML so the profile
 * stays data rather than markup, and schema-checked like everything else --
 * being invented is not a reason for it to be unstructured.
 */
const organisation = defineCollection({
  loader: file('./src/data/organisation.yml'),
  schema: z.object({
    name: z.string().min(1),
    tagline: z.string().min(1),
    founded: z.number().int(),
    staff: z.number().int(),
    what: z.string().min(1),
    why: z.string().min(1),
    people: z
      .array(
        z.object({
          name: z.string().min(1),
          role: z.string().min(1),
          about: z.string().min(1),
        }),
      )
      .min(1),
    systems: z
      .array(z.object({ name: z.string().min(1), about: z.string().min(1) }))
      .min(1),
  }),
});

export const collections = { nodes, scenarios, organisation };
