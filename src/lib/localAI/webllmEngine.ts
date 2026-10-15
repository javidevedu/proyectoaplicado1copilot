import type { MLCEngineInterface, InitProgressReport } from '@mlc-ai/web-llm';

export const LOCAL_MODEL = 'Qwen2.5-0.5B-Instruct-q4f16_1-MLC';

let enginePromise: Promise<MLCEngineInterface> | null = null;

export function hasWebGPU(): boolean {
  return typeof navigator !== 'undefined' && 'gpu' in navigator;
}

export async function isModelCached(): Promise<boolean> {
  if (!hasWebGPU()) return false;
  try {
    const { hasModelInCache } = await import('@mlc-ai/web-llm');
    return await hasModelInCache(LOCAL_MODEL);
  } catch {
    return false;
  }
}

export function getEngine(onProgress?: (r: InitProgressReport) => void): Promise<MLCEngineInterface> {
  if (!enginePromise) {
    enginePromise = (async () => {
      const webllm = await import('@mlc-ai/web-llm');
      return webllm.CreateMLCEngine(LOCAL_MODEL, { initProgressCallback: onProgress });
    })().catch((e) => {
      enginePromise = null;
      throw e;
    });
  }
  return enginePromise;
}

export async function chat(engine: MLCEngineInterface, system: string, user: string, maxTokens = 1500): Promise<string> {
  const res = await engine.chat.completions.create({
    messages: [{ role: 'system', content: system }, { role: 'user', content: user }],
    temperature: 0.7,
    max_tokens: maxTokens,
  });
  return res.choices[0]?.message?.content ?? '';
}
