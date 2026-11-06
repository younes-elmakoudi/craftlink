import { Button } from '@/components/ui';

/**
 * Showcase of every component of src/components/ui and its states.
 * Add a section here each time you add a component to the design system.
 */
export function DesignSystemPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Design system</h1>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Button</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>
    </div>
  );
}
