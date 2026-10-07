import { Suspense } from "react";
import SuccessContent from "./success-content";

export const dynamic = 'force-dynamic';

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <SuccessContent />
    </Suspense>
  );
}