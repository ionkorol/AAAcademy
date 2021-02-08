import { AccountLayout } from "components/account";
import { GetServerSideProps } from "next";
import React from "react";
import nookies from "nookies";
import firebaseAdmin from "utils/firebaseAdmin";
import { ApiResProp, InvoiceProp } from "utils/interfaces";
import { Container } from "react-bootstrap";

interface Props {
  data: InvoiceProp;
}

const Invoice: React.FC<Props> = (props) => {
  const { data } = props;

  return (
    <AccountLayout>
      <Container>{JSON.stringify(data)}</Container>
    </AccountLayout>
  );
};

export default Invoice;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { invoiceId } = ctx.query;
  const { token } = nookies.get(ctx);
  try {
    const { uid } = await firebaseAdmin.auth().verifyIdToken(token);
    const res = await fetch(
      `${process.env.SERVER}/api/users/parents/${uid}/invoices/${invoiceId}`
    );
    const jsonData = (await res.json()) as ApiResProp;
    if (jsonData.status) {
      return {
        props: {
          data: jsonData.data,
        },
      };
    } else {
      ctx.res.writeHead(302, { Location: "/" });
      ctx.res.end();
      return {
        props: {} as never,
      };
    }
  } catch (error) {
    ctx.res.writeHead(302, { Location: "/" });
    ctx.res.end();
    return {
      props: {} as never,
    };
  }
};
