import Container from "@/components/ui/Container";

const STEPS = [
  {
    step: "01",
    title: "Browse",
    desc: "Explore our real-time inventory with full specifications, verified mileage, and high-resolution photography.",
  },
  {
    step: "02",
    title: "Inquire or Test Drive",
    desc: "Connect directly with our team to discuss history, schedule a private showroom appointment, or book a test drive.",
  },
  {
    step: "03",
    title: "Inspect",
    desc: "Review full third-party inspection reports, title documentation, and vehicle maintenance history.",
  },
  {
    step: "04",
    title: "Drive Home",
    desc: "Finalize paperwork directly with our dealership and take immediate delivery or arrange enclosed transport.",
  },
];

export default function HomeHowItWorks() {
  return (
    <section className="py-20 md:py-28 bg-[#FAFAFA] border-t border-[#E8E8E8]">
      <Container>
        <div className="max-w-2xl mb-14">
          <span className="text-xs uppercase tracking-[0.14em] text-[#6B6B6B] block mb-3">
            Acquisition Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-[#0A0A0A]">
            How It Works
          </h2>
        </div>

        {/* 4 numbered steps in a row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {STEPS.map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-2xl border border-[#E8E8E8] space-y-4"
            >
              <span className="font-mono text-xs font-medium text-[#6B6B6B]">
                {item.step}
              </span>
              <h3 className="text-base font-medium text-[#0A0A0A]">
                {item.title}
              </h3>
              <p className="text-sm text-[#6B6B6B] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
