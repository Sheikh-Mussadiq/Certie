import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const PaymentForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    cardNumber: "",
    nameOnCard: "",
    expiryDate: "",
    cvv: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    // Format card number with spaces every 4 digits
    if (name === "cardNumber") {
      formattedValue =
        value
          .replace(/\s/g, "")
          .match(/.{1,4}/g)
          ?.join(" ") || "";
      if (formattedValue.length > 19) return; // 16 digits + 3 spaces
    }

    // Format expiry date as MM/YY
    if (name === "expiryDate") {
      formattedValue = value.replace(/\D/g, "");
      if (formattedValue.length > 2) {
        formattedValue =
          formattedValue.slice(0, 2) + "/" + formattedValue.slice(2, 4);
      }
      if (formattedValue.length > 5) return;
    }

    // Limit CVV to 3 or 4 digits
    if (name === "cvv" && value.length > 4) return;

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  useEffect(() => {
    const { cardNumber, nameOnCard, expiryDate, cvv } = formData;
    if (
      cardNumber.length === 19 &&
      nameOnCard &&
      expiryDate.length === 5 &&
      cvv.length >= 3
    ) {
      onSubmit(formData);
    }
  }, [formData, onSubmit]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8 border border-grey-outline rounded-xl p-4">
        <h3 className="font-semibold text-lg mb-2">Payment Details</h3>
        <p className="text-sm text-primary-grey mb-6">
          Enable plane backwards needle optimize synergy. Shelf-ware or hill
          want on land bandwagon opportunity great team.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="Enter Card Number"
                className="w-full p-3 border border-grey-outline rounded-md focus:outline-none focus:border-primary-orange"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Name on Card
              </label>
              <input
                type="text"
                name="nameOnCard"
                value={formData.nameOnCard}
                onChange={handleInputChange}
                placeholder="Enter Name on Card"
                className="w-full p-3 border border-grey-outline rounded-md focus:outline-none focus:border-primary-orange"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  className="w-full p-3 border border-grey-outline rounded-md focus:outline-none focus:border-primary-orange"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">CVV</label>
                <input
                  type="text"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="Enter CVV"
                  className="w-full p-3 border border-grey-outline rounded-md focus:outline-none focus:border-primary-orange"
                  required
                  maxLength={4}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default PaymentForm;
