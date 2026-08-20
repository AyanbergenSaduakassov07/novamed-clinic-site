import { Container } from "@/components/ui/container";
import { cn } from "@/lib/utils";

/** Top of every sub-page. Clears the fixed nav and keeps one rhythm. */
export function PageHeader({
  eyebrow,
  title,
  lead,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-surface pt-32 pb-10 md:pt-40 md:pb-14", className)}>
      <Container width="wide">
        {eyebrow && (
          <span className="text-2xs font-semibold tracking-[0.2em] text-ink-muted uppercase">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-4 text-xl font-extrabold text-ink sm:text-2xl">{title}</h1>
        {lead && <p className="measure mt-5 text-base text-ink-muted">{lead}</p>}
        {children}
      </Container>
    </div>
  );
}
