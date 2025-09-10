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
      question: "When do I need to make payment for an assessment?",
      answer:
        "Payment is required after the assessment has been carried out, but before the final report or certificate is released in the Certie system.",
    },
    {
      question: "Can I book an assessment without paying upfront?",
      answer:
        "Yes. You can book your assessment without advance payment. Payment is only due once the assessment is completed, prior to the results being uploaded.",
    },
    {
      question: "How are payments made?",
      answer:
        "Payments can be made securely online through Certie. We accept major debit and credit cards, as well as approved corporate payment methods for larger clients.",
    },
    {
      question: "Do you offer flexible payment terms for larger clients?",
      answer:
        "Yes. For larger or regular clients, tailored payment terms can be created, including monthly invoicing or extended credit arrangements. Please speak to our team to set this up.",
    },
    {
      question: "What happens if payment isn’t made promptly?",
      answer:
        "Your completed assessment will remain on hold within the system until payment is received. Once cleared, the assessment will be released immediately for your records and compliance needs.",
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
