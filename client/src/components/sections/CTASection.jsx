import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import Reveal from '../motion/Reveal';

const CTASection = () => (
  <section className="relative overflow-hidden bg-primary-600 py-20">
    <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/10" />
    <div className="pointer-events-none absolute -right-6 -top-6 h-48 w-48 rounded-full border border-white/10" />
    <div className="pointer-events-none absolute bottom-0 left-10 h-3 w-3 rounded-full bg-accent-400" />

    <Reveal className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
      <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Your infrastructure, orbiting one control plane.
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-primary-100">
        Spin up your first service in minutes. No setup calls, no procurement forms.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Button
          to="/register"
          size="lg"
          rightIcon={<ArrowRight size={18} />}
          className="bg-white text-primary-700 hover:bg-primary-50"
        >
          Start building free
        </Button>
        <Button
          to="/contact"
          variant="outline"
          size="lg"
          className="border-white/30 bg-transparent text-white hover:bg-white/10"
        >
          Talk to sales
        </Button>
      </div>
    </Reveal>
  </section>
);

export default CTASection;
