
const SectionContainer = ({ children, className = "", bgColor = "bg-warm-off-white" }) => {
  return (
    <section className={`py-24 md:py-32 px-6 ${bgColor} ${className}`}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </section>
  );
};

export default SectionContainer;
