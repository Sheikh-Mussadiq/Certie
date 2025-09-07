import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus } from "lucide-react";

const FAQItem = ({ question, answer, isOpen, toggleOpen }) => {
  return (
    <div className="bg-grey-fill/50 rounded-xl p-4 m-1">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleOpen}
      >
        <h3 className="font-medium">{question}</h3>
        <button className="w-6 h-6 flex items-center justify-center">
          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="mt-2 text-sm text-primary-grey pr-6">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQAccordion = () => {
  const [openIndex, setOpenIndex] = useState(-1);

  const faqs = [
    {
      question: "What is Modoin?",
      answer:
        "Modoin refers to a specialized methodology for commercial & residential property fire risk assessments where fire hazards are identified and mitigated. Potenti tellus hendrerit facilisis praesent nunc habitasse convallis semper bibendum vitae molestie phasellus iaculis diam elit.",
    },
    {
      question: "Do you have a monthly plan?",
      answer:
        "Yes, we offer flexible monthly subscription plans for regular compliance assessments. This includes scheduled visits, ongoing support, and access to our compliance dashboard.",
    },
    {
      question: "Do you have a monthly plan?",
      answer:
        "Yes, we offer flexible monthly subscription plans for regular compliance assessments. This includes scheduled visits, ongoing support, and access to our compliance dashboard.",
    },
    {
      question: "Do you have a monthly plan?",
      answer:
        "Yes, we offer flexible monthly subscription plans for regular compliance assessments. This includes scheduled visits, ongoing support, and access to our compliance dashboard.",
    },
  ];

  return (
    <motion.div
      className="bg-white rounded-xl p-6 border border-grey-outline"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>

      <div className="">
        {faqs.map((faq, index) => (
          <FAQItem
            key={index}
            question={faq.question}
            answer={faq.answer}
            isOpen={index === openIndex}
            toggleOpen={() => setOpenIndex(index === openIndex ? -1 : index)}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default FAQAccordion;
