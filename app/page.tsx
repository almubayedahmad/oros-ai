import { getDemoMode } from "@/lib/providers";

export default function HomePage() {
  const demoMode = getDemoMode();

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-3 shadow-glow backdrop-blur-sm">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-blue-300">Oros Ai</p>
            <h1 className="mt-1 text-xl font-semibold text-white">Unified intelligence layer</h1>
          </div>
          <div className="rounded-full border border-violet-500/40 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200">
            {demoMode ? "Demo mode" : "Live providers enabled"}
          </div>
        </header>

        {demoMode ? (
          <div className="rounded-2xl border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            No provider API key is configured yet. Oros is running in demo mode only, and no real provider response is being presented as production output.
          </div>
        ) : (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            Live provider layer is active. Oros selects the best enabled provider automatically.
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
            <p className="mb-4 text-sm font-medium text-slate-300">Recent chats</p>
            <div className="space-y-2">
              <div className="rounded-xl bg-slate-800/80 px-3 py-2 text-sm text-slate-200">Welcome to Oros</div>
              <div className="rounded-xl border border-dashed border-slate-700 px-3 py-2 text-sm text-slate-400">Demo conversation</div>
            </div>
          </aside>

          <section className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-glow">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">Active conversation</p>
                <h2 className="text-lg font-semibold text-white">Oros Ai</h2>
              </div>
              <div className="rounded-full border border-blue-500/35 bg-blue-500/10 px-2.5 py-1 text-xs text-blue-200">
                {demoMode ? "Demo" : "Provider connected"}
              </div>
            </div>

            <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-5">
              <div className="ml-auto max-w-xl rounded-2xl rounded-br-md bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-sm text-white">
                Hello Oros, summarize how the provider layer works.
              </div>
              <div className="max-w-xl rounded-2xl rounded-bl-md border border-slate-700 bg-slate-900 px-4 py-3 text-sm text-slate-100">
                {demoMode
                  ? "Demo mode is active because no server API keys were configured. The provider layer is ready to accept OpenAI, Anthropic, and Google-compatible credentials when deployed to Vercel."
                  : "The provider layer validates each configured backend, exposes a standard interface, and routes requests to the best available model. If one fails, Oros retries with the next compatible provider."}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-3">
              <input
                aria-label="Prompt"
                className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-200 outline-none ring-0 placeholder:text-slate-500"
                placeholder="Ask Oros anything..."
                disabled
              />
              <button className="rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-blue-500/20">
                Send
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
