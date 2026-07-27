import { motion } from 'framer-motion';

/**
 * Wraps a section/block in a consistent fade+rise reveal that fires once,
 * the moment it scrolls into view. Keeps motion timing uniform across the
 * whole homepage instead of every section inventing its own.
 */
const Reveal = ({ delay = 0, className, children, as = 'div' }) => {
  const MotionTag = motion[as] ?? motion.div;

  return (
    <MotionTag
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, ease: 'easeOut', delay }}
      className={className}
    >
      {children}
    </MotionTag>
  );
};

export default Reveal;
