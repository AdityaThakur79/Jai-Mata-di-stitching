import React from "react";

/**
 * Standard page padding for all employee sidebar views.
 * Matches All Invoices: py-4 px-2 sm:px-4 + container mx-auto
 */
const PageContent = ({ children, fullWidth = false }) => (
  <div className="w-full py-4 px-2 sm:px-4">
    <div className={fullWidth ? "w-full" : "container mx-auto"}>{children}</div>
  </div>
);

export default PageContent;
