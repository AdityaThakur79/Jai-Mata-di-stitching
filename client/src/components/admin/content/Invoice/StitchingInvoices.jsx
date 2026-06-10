import React from "react";
import InvoiceOrdersView from "./InvoiceOrdersView";

const StitchingInvoices = () => {
  return (
    <InvoiceOrdersView
      title="Stitching Invoice"
      subtitle="Manage and track stitching invoices from all sources"
      fixedOrderType="stitching"
    />
  );
};

export default StitchingInvoices;
