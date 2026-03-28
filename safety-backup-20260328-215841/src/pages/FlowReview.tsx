import { CalculatorFlowReview } from "@/components/admin/CalculatorFlowReview";

export default function FlowReview() {
  return (
    <main className="min-h-[60vh] bg-background text-foreground">
      <section className="container mx-auto max-w-6xl px-4 py-10">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Flow Review</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Interne Review-Ansicht für Flow-Screenshots & Export.
          </p>
        </header>

        <CalculatorFlowReview />
      </section>
    </main>
  );
}
