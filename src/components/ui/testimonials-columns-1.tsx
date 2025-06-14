
"use client";
import React from "react";
import { motion } from "motion/react";

const testimonials = [
  {
    text: "My favorite solution in the market. We work 5x faster with Interact.",
    image: "https://i.pravatar.cc/150?img=1",
    name: "Alex",
    role: "CEO at TechCorp",
  },
  {
    text: "I'm confident my data is safe with Interact. I can't say that about other providers.",
    image: "https://i.pravatar.cc/150?img=2",
    name: "Dan",
    role: "CTO at SecureNet",
  },
  {
    text: "I know it's cliche, but we were lost before we found Interact. Can't thank you guys enough!",
    image: "https://i.pravatar.cc/150?img=3",
    name: "Stephanie",
    role: "COO at InnovateCo",
  },
  {
    text: "Interact's products make planning for the future seamless. Can't recommend them enough!",
    image: "https://i.pravatar.cc/150?img=4",
    name: "Marie",
    role: "CFO at FuturePlanning",
  },
  {
    text: "If I could give 11 stars, I'd give 12.",
    image: "https://i.pravatar.cc/150?img=5",
    name: "Andre",
    role: "Head of Design at CreativeSolutions",
  },
  {
    text: "SO SO SO HAPPY WE FOUND YOU GUYS!!!! I'd bet you've saved me 100 hours so far.",
    image: "https://i.pravatar.cc/150?img=6",
    name: "Jeremy",
    role: "Product Manager at TimeWise",
  },
  {
    text: "Took some convincing, but now that we're on Interact, we're never going back.",
    image: "https://i.pravatar.cc/150?img=7",
    name: "Pam",
    role: "Marketing Director at BrandBuilders",
  },
  {
    text: "I would be lost without Interact's in-depth analytics. The ROI is EASILY 100X for us.",
    image: "https://i.pravatar.cc/150?img=8",
    name: "Daniel",
    role: "Data Scientist at AnalyticsPro",
  },
  {
    text: "It's just the best. Period.",
    image: "https://i.pravatar.cc/150?img=9",
    name: "Fernando",
    role: "UX Designer at UserFirst",
  },
];

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: typeof testimonials;
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          y: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div className="p-10 rounded-3xl border shadow-lg shadow-primary/10 max-w-xs w-full" key={i}>
                  <div>{text}</div>
                  <div className="flex items-center gap-2 mt-5">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full"
                    />
                    <div className="flex flex-col">
                      <div className="font-medium tracking-tight leading-5">{name}</div>
                      <div className="leading-5 opacity-60 tracking-tight">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export const Testimonials = () => {
  return (
    <section className="bg-background my-20 relative">
      <div className="container z-10 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-[540px] mx-auto"
        >
          <div className="flex justify-center">
            <div className="border py-1 px-4 rounded-lg">Testimonials</div>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold tracking-tighter mt-5">
            What our users say
          </h2>
          <p className="text-center mt-5 opacity-75">
            See what our customers have to say about us.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
};
