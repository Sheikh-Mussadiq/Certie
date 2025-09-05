import { useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";

const LogBookModal = ({
  isOpen,
  closeModal,
  onSubmit,
  loading,
  error,
  frequencyOptions,
}) => {
  const [form, setForm] = useState({
    logbook_type: "",
    description: "",
    frequency: frequencyOptions[0] || "Monthly",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold text-gray-900"
                  >
                    Create Custom LogBook
                  </Dialog.Title>
                  <button
                    type="button"
                    className="rounded-md text-gray-400 hover:text-gray-600 focus:outline-none"
                    onClick={closeModal}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      name="logbook_type"
                      value={form.logbook_type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange focus:ring-1 focus:ring-primary-orange"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange focus:ring-1 focus:ring-primary-orange"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Frequency
                    </label>
                    <select
                      name="frequency"
                      value={form.frequency}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange focus:ring-1 focus:ring-primary-orange"
                      required
                    >
                      {frequencyOptions.map((freq) => (
                        <option key={freq} value={freq}>
                          {freq}
                        </option>
                      ))}
                    </select>
                  </div>

                  {error && <div className="text-red-500 text-sm">{error}</div>}

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full bg-primary-black text-white py-2 rounded-lg hover:bg-primary-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create LogBook"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default LogBookModal;
