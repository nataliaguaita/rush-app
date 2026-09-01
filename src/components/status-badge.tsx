import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getStatusMeta } from "@/lib/status";

export function StatusBadge({
  status,
  className,
}: {
  status: string;
  className?: string;
}) {
  const meta = getStatusMeta(status);
  return (
    <Badge variant="outline" className={cn("border-transparent", meta.className, className)}>
      {meta.label}
    </Badge>
  );
}
