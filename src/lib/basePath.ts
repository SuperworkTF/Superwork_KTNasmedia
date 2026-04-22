// Must match `basePath` in next.config.ts. `next/image` does not auto-prefix
// basePath when combined with `output: 'export'` and `images.unoptimized: true`,
// so static asset URLs must be composed with this prefix explicitly.
export const BASE_PATH = '/Superwork_KTNasmedia';

export function withBasePath(path: string): string {
  if (!path.startsWith('/')) return `${BASE_PATH}/${path}`;
  return `${BASE_PATH}${path}`;
}
