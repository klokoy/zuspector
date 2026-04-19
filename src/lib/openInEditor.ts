type SourceMap = {
  sources?: string[];
  sourceRoot?: string;
  sourcesContent?: string[];
};

async function fetchWithSourceMap(fileUrl: string): Promise<{ js: string; map: SourceMap | null }> {
  const res = await fetch(fileUrl);
  const js = await res.text();

  const inlineMatch = js.match(
    /\/\/# sourceMappingURL=data:application\/json;base64,([A-Za-z0-9+/=]+)/
  );
  if (inlineMatch) return { js, map: JSON.parse(atob(inlineMatch[1])) as SourceMap };

  const refMatch = js.match(/\/\/# sourceMappingURL=(\S+)/);
  if (refMatch) {
    const mapRes = await fetch(new URL(refMatch[1], fileUrl).href);
    if (mapRes.ok) return { js, map: (await mapRes.json()) as SourceMap };
  }

  return { js, map: null };
}

function findActionLine(js: string, actionName: string): number {
  const patterns = [
    new RegExp(`\\b${actionName}\\s*:`),
    new RegExp(`\\b${actionName}\\s*=`),
    new RegExp(`function\\s+${actionName}\\b`),
  ];
  const lines = js.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (patterns.some(p => p.test(lines[i]))) return i + 1;
  }
  return 0;
}

export async function openInEditor(storeFileUrl: string, actionName: string): Promise<boolean> {
  try {
    const { js, map } = await fetchWithSourceMap(storeFileUrl);

    const raw = map?.sources?.[0];
    const base = map?.sourceRoot ? new URL(map.sourceRoot, storeFileUrl).href : storeFileUrl;
    const serverPath = raw
      ? new URL(raw, base).pathname   // e.g. /src/demo/stores.ts
      : new URL(storeFileUrl).pathname;

    // Prefer original TypeScript from sourcesContent — esbuild line numbers drift
    const searchContent = map?.sourcesContent?.[0] ?? js;
    const line = findActionLine(searchContent, actionName);
    const fileParam = serverPath.replace(/^\//, '') + (line ? `:${line}` : '');

    const origin = new URL(storeFileUrl).origin;
    const res = await fetch(`${origin}/__open-in-editor?file=${encodeURIComponent(fileParam)}`);
    return res.ok;
  } catch {
    return false;
  }
}
