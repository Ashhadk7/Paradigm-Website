import { motion } from 'framer-motion';

const ProofPoint = () => {
  const stats = [
    { label: "Years of Expertise", value: "35+" },
    { label: "Top 100 Pension Funds Served", value: "65" },
    { label: "Client Assets & Relationships", value: "Fortune 500" },
    { label: "Investment Philosophy", value: "Data-Driven" },
  ];

  return (
    <div className="bg-white rounded-2xl p-8 md:p-16 shadow-lg border border-gray-100">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
        {stats.map((stat, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="text-4xl md:text-5xl font-serif text-paradigm-dark-blue mb-2">{stat.value}</div>
            <div className="text-xs uppercase tracking-widest text-blue-grey font-semibold">{stat.label}</div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-16 pt-8 border-t border-gray-100">
        <p className="text-center text-sm text-blue-grey uppercase tracking-[0.2em] mb-8">Trusted by Global Institutions</p>
        <div className="flex flex-wrap justify-center items-center gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
          {/* Placeholder for Logos - In a real app these would be SVG logos */}
          <span className="font-serif text-xl font-bold">GENERAL MOTORS</span>
          <span className="font-serif text-xl font-bold">AMERICAN EXPRESS</span>
          <span className="font-serif text-xl font-bold">PENSION FUNDS</span>
          <span className="font-serif text-xl font-bold">ENDOWMENTS</span>
        </div>
      </div>
    </div>
  );
};

export default ProofPoint;
