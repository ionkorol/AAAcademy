import { AdminLayout, InvoiceForm } from "components/admin";
import React from "react";

interface Props {}

const AddInvoice: React.FC<Props> = (props) => {
  return (
    <AdminLayout>
      <InvoiceForm />
    </AdminLayout>
  );
};

export default AddInvoice;
