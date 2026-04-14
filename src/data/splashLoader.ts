/**
 * Lazy-load a single character's splash art by code.
 * Vite code-splits each ./splash/*.ts into its own chunk,
 * so only the requested character's image is downloaded.
 */
const modules = import.meta.glob<{ default: string }>('./splash/*.ts');

export async function loadSplash(code: string): Promise<string | undefined> {
  const key = `./splash/${code}.ts`;
  const loader = modules[key];
  if (!loader) return undefined;
  const mod = await loader();
  return mod.default;
}
