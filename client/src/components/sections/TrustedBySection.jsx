import Reveal from '../motion/Reveal';

// Fictional companies — Zen-G Wear is a fictional product, so these are
// invented wordmarks rather than real, trademarked brand logos.
const COMPANIES = [
  'Nimbus Analytics',
  'Vertex Labs',
  'Northwind Systems',
  'Lumen Robotics',
  'Atlas Fintech',
  'Orbital Health',
  'Fathom Data',
  'Greywolf Media',
];

const TrustedBySection = () => (
  <section className="border-y border-mist bg-white py-12">
    <Reveal className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        Trusted by engineering teams at
      </p>

      <div className="relative mt-7 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent sm:w-28" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent sm:w-28" />

        <div className="flex w-max animate-marquee items-center gap-16">
          {[...COMPANIES, ...COMPANIES].map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="font-display text-lg font-semibold tracking-tight text-slate-300"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  </section>
);

export default TrustedBySection;
