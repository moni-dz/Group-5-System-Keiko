import { Loader2 } from "lucide-react";

export function LoadingSkeleton() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <Loader2 className="h-8 w-8 animate-spin text-red-500" />
    </div>
  );
}

interface ErrorSkeletonProps {
  message: string;
}

export function ErrorSkeleton(props: ErrorSkeletonProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      {props.message}
    </div>
  );
}