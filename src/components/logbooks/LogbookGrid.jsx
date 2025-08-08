import { motion } from "framer-motion";
import { CheckCircle2, PauseCircle } from "lucide-react";

const LogbookGrid = ({
  logbooks,
  canManage,
  toggleLoadingId,
  onToggleActive,
  onOpen,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {logbooks.map((logbook, index) => (
        <motion.div
          key={logbook.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: index * 0.03 }}
          className="bg-white rounded-xl border border-grey-outline transition-colors cursor-pointer shadow-sm hover:shadow-md"
          onClick={(e) => {
            if (e.target.type !== "checkbox") onOpen(logbook);
          }}
        >
          <div className="flex flex-col items-start justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-grey-fill flex items-center justify-center">
                <span className="w-6 h-6 rounded bg-primary-orange/10 text-primary-orange text-xs flex items-center justify-center font-semibold">
                  {logbook.name?.charAt(0) || "L"}
                </span>
              </div>
              <div>
                <h3 className="font-medium text-primary-black">
                  {logbook.name}
                </h3>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-primary-grey">
                    {logbook.frequency}
                  </p>
                  {logbook.isActive ? (
                    <span className="inline-flex items-center gap-1 text-xs text-secondary-green">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-primary-grey">
                      <PauseCircle className="w-3.5 h-3.5" /> Inactive
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-primary-grey mt-4 line-clamp-3">
                {logbook.description}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2 bg-grey-fill p-4 rounded-b-xl">
            <button
              className="text-sm bg-white border border-grey-outline shadow-sm text-primary-black transition-colors px-4 py-2 rounded-lg"
              type="button"
            >
              View detail
            </button>

            <label
              className="relative inline-flex items-center cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                className="sr-only peer"
                checked={logbook.isActive}
                onChange={() => onToggleActive(logbook)}
                disabled={!canManage || toggleLoadingId === logbook.id}
              />
              <div
                className={`w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-black ${
                  toggleLoadingId === logbook.id ? "opacity-50" : ""
                }`}
              ></div>
            </label>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default LogbookGrid;
