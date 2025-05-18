import { useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

const LogBooksTab = () => {
  const [activeTab, setActiveTab] = useState("Active");
  const [searchTerm, setSearchTerm] = useState("");

  const logbooks = [
    {
      id: 1,
      icon: "/src/assets/icons/zapier.png",
      name: "Emergency Light Flick Test",
      frequency: "Monthly",
      regulation: "BS' EN 50172 - Monthly test requirment",
      description:
        "Enrich your CRM data by integrating with Clearbit for better customer insights and lead generation.",
      isActive: true,
    },
    {
      id: 2,
      icon: "/src/assets/icons/monday.png",
      name: "Emergency Light Flick Test",
      frequency: "Monthly",
      regulation: "BS' EN 50172 - Monthly test requirment",
      description:
        "Enrich your CRM data by integrating with Clearbit for better customer insights and lead generation.",
      isActive: true,
    },
    {
      id: 3,
      icon: "/src/assets/icons/clickup.png",
      name: "Emergency Light Flick Test",
      frequency: "Monthly",
      regulation: "BS' EN 50172 - Monthly test requirment",
      description:
        "Enrich your CRM data by integrating with Clearbit for better customer insights and lead generation.",
      isActive: true,
    },
    {
      id: 4,
      icon: "/src/assets/icons/asana.png",
      name: "Emergency Light Flick Test",
      frequency: "Monthly",
      regulation: "BS' EN 50172 - Monthly test requirment",
      description:
        "Enrich your CRM data by integrating with Clearbit for better customer insights and lead generation.",
      isActive: false,
    },
    {
      id: 5,
      icon: "/src/assets/icons/slack.png",
      name: "Emergency Light Flick Test",
      frequency: "Monthly",
      regulation: "BS' EN 50172 - Monthly test requirment",
      description:
        "Enrich your CRM data by integrating with Clearbit for better customer insights and lead generation.",
      isActive: false,
    },
    {
      id: 6,
      icon: "/src/assets/icons/dropbox.png",
      name: "Emergency Light Flick Test",
      frequency: "Monthly",
      regulation: "BS' EN 50172 - Monthly test requirment",
      description:
        "Enrich your CRM data by integrating with Clearbit for better customer insights and lead generation.",
      isActive: false,
    },
  ];

  const filteredLogbooks = logbooks.filter(
    (logbook) =>
      logbook.isActive === (activeTab === "Active") &&
      (logbook.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        logbook.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-primary-black">LogBooks</h2>
          <p className="text-sm text-primary-grey">
            Streamline work, save your time and growth easier
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary-black text-white rounded-lg hover:bg-primary-black/90 transition-colors">
          <Plus className="w-4 h-4" />
          Create Custom LogBook
        </button>
      </div>

      <div className="flex gap-4 border-b border-grey-outline">
        {["Active", "In Active"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-2 relative ${
              activeTab === tab
                ? "text-primary-orange"
                : "text-primary-grey hover:text-primary-black"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                layoutId="activeLogbookTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-orange"
              />
            )}
          </button>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-grey-outline rounded-lg focus:outline-none focus:border-primary-orange"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLogbooks.map((logbook) => (
          <div
            key={logbook.id}
            className="bg-white rounded-lg border border-grey-outline p-6 hover:border-primary-orange transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-grey-fill flex items-center justify-center">
                  <img
                    src={logbook.icon}
                    alt={logbook.name}
                    className="w-6 h-6"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-primary-black">
                    {logbook.name}
                  </h3>
                  <p className="text-sm text-primary-grey">
                    {logbook.frequency}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  defaultChecked={logbook.isActive}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-orange"></div>
              </label>
            </div>

            <p className="text-xs text-primary-grey mb-4">
              {logbook.regulation}
            </p>
            <p className="text-sm text-primary-grey mb-4">
              {logbook.description}
            </p>

            <button className="text-sm text-primary-orange hover:text-primary-black transition-colors">
              View detail
            </button>
          </div>
        ))}

        {activeTab === "Active" && (
          <div className="border-2 border-dashed border-grey-outline rounded-lg p-6 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 rounded-lg bg-grey-fill flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-primary-grey" />
            </div>
            <h3 className="font-medium text-primary-black mb-1">
              Create Custom LogBook
            </h3>
            <p className="text-sm text-primary-grey mb-4">
              Add a New logbook tailored to your specific
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogBooksTab;
