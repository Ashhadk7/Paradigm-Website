import { motion } from 'framer-motion';
import { Users, Landmark } from 'lucide-react';

const AudienceSplit = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-xl shadow-2xl">
      <motion.div 
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.5 }}
        className="relative group cursor-pointer bg-paradigm-dark-blue p-12 md:p-20 flex flex-col justify-between"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <Users size={120} />
        </div>
        <div>
          <span className="text-warm-gold tracking-widest text-xs uppercase mb-4 block">Tailored for</span>
          <h3 className="text-4xl font-serif text-warm-off-white mb-6">Wealth Advisors & Family Offices</h3>
          <p className="text-blue-grey text-lg mb-8 leading-relaxed">
            Break free from the "style-lock trap" and offer your clients proprietary investment stories that drive retention and growth.
          </p>
        </div>
        <a href="/advisors" className="text-warm-gold font-medium flex items-center gap-2 group-hover:gap-4 transition-all">
          Explore Advisor Solutions <span>→</span>
        </a>
      </motion.div>

      <motion.div 
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.5 }}
        className="relative group cursor-pointer bg-near-black p-12 md:p-20 flex flex-col justify-between border-l border-white/5"
      >
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
          <Landmark size={120} />
        </div>
        <div>
          <span className="text-warm-gold tracking-widest text-xs uppercase mb-4 block">Designed for</span>
          <h3 className="text-4xl font-serif text-warm-off-white mb-6">Institutional Investors</h3>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            Harness 35 years of expertise serving 65 of the top 100 pension funds with adaptive, data-driven equity strategies.
          </p>
        </div>
        <a href="/institutions" className="text-warm-gold font-medium flex items-center gap-2 group-hover:gap-4 transition-all">
          View Institutional Strategies <span>→</span>
        </a>
      </motion.div>
    </div>
  );
};

export default AudienceSplit;
