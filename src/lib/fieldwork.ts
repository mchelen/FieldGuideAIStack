import { getCollection, type CollectionEntry } from 'astro:content';

export type ScenarioEntry = CollectionEntry<'scenarios'>;

/** Scenarios in reading order. */
export async function loadScenarios(): Promise<ScenarioEntry[]> {
  const all = await getCollection('scenarios');
  return all.sort((a, b) => a.data.order - b.data.order);
}

/**
 * Node id -> the scenarios that make that concept concrete.
 *
 * Built by inverting each scenario's `concepts` list rather than by having
 * nodes declare their scenarios, so a node file never has to know that
 * fieldwork exists. The sourced half of the site stays independent of the
 * invented half, which is the point of keeping them in separate collections.
 */
export async function scenariosByConcept(): Promise<Map<string, ScenarioEntry[]>> {
  const scenarios = await loadScenarios();
  const out = new Map<string, ScenarioEntry[]>();
  for (const s of scenarios) {
    for (const ref of s.data.concepts) {
      const list = out.get(ref.id) ?? [];
      list.push(s);
      out.set(ref.id, list);
    }
  }
  return out;
}
