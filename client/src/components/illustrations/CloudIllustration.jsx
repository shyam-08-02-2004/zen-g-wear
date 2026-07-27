import { motion } from 'framer-motion';

const NODES = [
  { label: 'Compute', angle: -50, ring: 1 },
  { label: 'Storage', angle: 35, ring: 1 },
  { label: 'Database', angle: 155, ring: 1 },
  { label: 'Security', angle: 210, ring: 2 },
  { label: 'Network', angle: 100, ring: 2 },
];

const RING_RADIUS = { 1: 150, 2: 210 };

const nodePosition = (angle, radius) => {
  const rad = (angle * Math.PI) / 180;
  return { x: 260 + radius * Math.cos(rad), y: 260 + radius * Math.sin(rad) };
};

/**
 * Zen-G Wear's hero illustration — a live diagram, not decoration: the
 * central sphere is the platform, the orbiting nodes are the services in
 * the catalog below, and the connecting lines are the thing being sold
 * (everything talking to everything, reliably).
 */
const CloudIllustration = ({ className }) => (
  <div className={className}>
    <motion.div
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 520 520" className="h-full w-full" role="img" aria-label="Diagram of Zen-G Wear's core connected to compute, storage, database, security, and network services">
        <defs>
          <radialGradient id="hero-sphere-sheen" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(200 200) rotate(45) scale(160)">
            <stop stopColor="white" stopOpacity="0.45" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="hero-glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(260 260) scale(260)">
            <stop stopColor="#2454FF" stopOpacity="0.25" />
            <stop offset="1" stopColor="#2454FF" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="260" cy="260" r="260" fill="url(#hero-glow)" />

        {/* Static orbit rings */}
        <circle cx="260" cy="260" r={RING_RADIUS[1]} fill="none" stroke="#5E86FF" strokeOpacity="0.25" strokeWidth="1" />
        <circle cx="260" cy="260" r={RING_RADIUS[2]} fill="none" stroke="#5E86FF" strokeOpacity="0.15" strokeWidth="1" />

        {/* Connecting lines from core to each node */}
        {NODES.map((node) => {
          const { x, y } = nodePosition(node.angle, RING_RADIUS[node.ring]);
          return (
            <line
              key={`line-${node.label}`}
              x1="260"
              y1="260"
              x2={x}
              y2={y}
              stroke="#8FB0FF"
              strokeOpacity="0.35"
              strokeWidth="1.5"
              strokeDasharray="4 5"
            />
          );
        })}

        {/* Central sphere */}
        <circle cx="260" cy="260" r="68" fill="#2454FF" />
        <circle cx="260" cy="260" r="68" fill="url(#hero-sphere-sheen)" />
        <text x="260" y="266" textAnchor="middle" fontSize="15" fontWeight="600" fill="white" fontFamily="'Space Grotesk', sans-serif">
          Zen-G Wear
        </text>

        {/* Orbiting service nodes */}
        {NODES.map((node, i) => {
          const { x, y } = nodePosition(node.angle, RING_RADIUS[node.ring]);
          return (
            <g key={node.label}>
              <circle cx={x} cy={y} r="30" fill="white" stroke="#DCE3EE" />
              <circle cx={x} cy={y} r="5" fill={i % 2 === 0 ? '#2454FF' : '#F5A623'} />
              <text
                x={x}
                y={y + 46}
                textAnchor="middle"
                fontSize="12"
                fontWeight="500"
                fill="#F3F6FB"
                fontFamily="Inter, sans-serif"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </motion.div>
  </div>
);

export default CloudIllustration;
