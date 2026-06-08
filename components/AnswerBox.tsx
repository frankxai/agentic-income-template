/**
 * The AEO answer box — a direct, citable answer at the top of a post.
 * This is the surface AI search engines lift. Lead with the conclusion.
 */
export function AnswerBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-xl border border-accent/30 bg-accent/[0.06] px-5 py-4">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-accent">The short answer</div>
      <div className="text-[1.05rem] leading-relaxed text-ink">{children}</div>
    </div>
  )
}
