import React from "react";
import CustomSelect from "../ui/CustomSelect";

const PropertyFilter = ({ properties, selectedProperty, onSelectProperty }) => {
  const options = [
    { value: null, label: "All Properties" },
    ...properties.map((property) => ({
      value: property.id,
      label: property.name,
    })),
  ];

  const handleSelect = (value) => {
    onSelectProperty(value);
  };

  return (
    <CustomSelect
      value={selectedProperty}
      onChange={handleSelect}
      options={options}
      placeholder="All Properties"
      className="w-60"
    />
  );
};

export default PropertyFilter;
