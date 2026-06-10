import React from "react";
import InvoiceOrdersView from "./InvoiceOrdersView";

const FabricInvoices = () => {
  return (
    <InvoiceOrdersView
      title="Fabric Invoice"
      subtitle="Manage and track fabric invoices from all sources"
      fixedOrderType="fabric"
    />
  );
};

export default FabricInvoices;
