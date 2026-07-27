import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Quote } from 'lucide-react';
import Reveal from '../motion/Reveal';

// Fictional customers — Zen-G Wear is a fictional product, so these quotes
// are invented and not attributed to real, named individuals.
const TESTIMONIALS = [
  {
    quote:
      "We moved four services over in an afternoon. The billing alone used to take one of our engineers a full day a month — now it's just correct.",
    name: 'Priya Nakamura',
    title: 'VP Engineering, Nimbus Analytics',
  },
  {
    quote:
      'Zen-G Wear is the first platform where our security review took less time than the migration itself. Audit logs were already exactly what we needed.',
    name: 'Marcus Webb',
    title: 'Head of Infrastructure, Vertex Labs',
  },
  {
    quote:
      "Support answered a 2am page in six minutes with an actual fix, not a ticket number. That's the whole pitch, honestly.",
    name: 'Elena Kovač',
    title: 'Founder, Orbital Health',
  },
];

const getInitials = (name) =>
  name
    .split(' ')
    .map((p) => p[0])
    .join('');

const TestimonialsSection = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((i) => (i + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const active = TESTIMONIALS[index];

  return (
    <section className="bg-ink py-24">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <Reveal>
          <Quote className="mx-auto text-primary-400" size={32} />

          <div className="relative mt-6 min-h-[9rem] sm:min-h-[7rem]">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={index}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="font-display text-xl font-medium leading-relaxed text-white sm:text-2xl"
              >
                “{active.quote}”
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
              {getInitials(active.name)}
            </span>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">{active.name}</p>
              <p className="text-sm text-slate-400">{active.title}</p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.name}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show testimonial from ${t.name}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? 'w-6 bg-primary-400' : 'w-1.5 bg-white/20'
                }`}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default TestimonialsSection;
