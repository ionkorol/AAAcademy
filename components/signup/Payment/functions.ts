import firebaseClient from "utils/firebaseClient";
import { ChildProp, ParentProp, UserProp } from "utils/interfaces";
import { CreateOrderObj } from "./interfaces";

export const GetOrderObj = async (
  childData: ChildProp[],
  parentData: ParentProp,
  couponData: any
) => {
  // Calculate Total and SubTotal Price
  let subTotalPrice = 0;
  childData.forEach((child) => {
    child.clubs.forEach((club) => {
      subTotalPrice += club.price; // club.price
    });
  });
  let totalPrice = subTotalPrice;
  if (couponData) {
    childData.forEach((child) => {
      child.clubs.forEach((club) => {
        totalPrice += -club.price / 2; // club.price
      });
    });
  }
  totalPrice += Number(process.env.NEXT_PUBLIC_REGISTRATION_FEE);

  // Calculate Invoice Number
  const invoiceId =
    Number(
      (
        await firebaseClient
          .firestore()
          .collection("orders")
          .orderBy("id", "asc")
          .limitToLast(1)
          .get()
      ).docs[0].id
    ) + 1;

  // Create the Items Array
  const itemsData = [];
  childData.forEach((child) => {
    child.clubs.forEach((club) => {
      itemsData.push({
        name: `${club.title} - ${child.firstName} ${child.lastName}`,
        unit_amount: {
          currency_code: "USD",
          value: String(club.price),
        },
        quantity: "1",
        sku: club.id,
        category: "DIGITAL_GOODS",
      });
    });
  });

  const paypalCreateOrderOptions: CreateOrderObj = {
    intent: "CAPTURE",
    payer: {
      name: {
        given_name: parentData.firstName,
        surname: parentData.lastName,
      },
      email_address: parentData.email,
    },
    purchase_units: [
      {
        amount: {
          value: totalPrice.toFixed(2),
          currency_code: "USD",
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: (
                subTotalPrice + Number(process.env.NEXT_PUBLIC_REGISTRATION_FEE)
              ).toFixed(2),
            },
            discount: {
              currency_code: "USD",
              value: couponData ? (subTotalPrice / 2).toFixed(2) : "0.00",
            },
          },
        },
        invoice_id: String(invoiceId),
        items: [
          ...itemsData,
          {
            name: "Registration Fee",
            unit_amount: {
              currency_code: "USD",
              value: String(process.env.NEXT_PUBLIC_REGISTRATION_FEE),
            },
            quantity: "1",
            sku: "1",
            category: "DIGITAL_GOODS",
          },
        ],
      },
    ],
    application_context: {
      brand_name: "Always Active Academy",
    },
  };
  return paypalCreateOrderOptions;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const onRun = async (
  childData: ChildProp[],
  parentData: ParentProp,
  couponData: any,
  onPaid: () => any,
  paypal: React.MutableRefObject<any>
) => {
  if (paypal.current.childNodes.length > 0) {
    paypal.current.childNodes.forEach((node) => {
      paypal.current.removeChild(node);
    });
  }

  // Calculate Total Price
  let totalPrice = 0;
  childData.forEach((child) => {
    child.clubs.forEach((club) => {
      totalPrice += club.price; // club.price
    });
  });

  // Create the Items Array
  const itemsData = [];
  childData.forEach((child) => {
    child.clubs.forEach((club) => {
      itemsData.push({
        name: `${club.title} - ${child.firstName} ${child.lastName}`,
        unit_amount: {
          currency_code: "USD",
          value: String(club.price), // club.price
        },
        quantity: "1",
        sku: club.id,
        category: "DIGITAL_GOODS",
      });
    });
  });

  const paypalCreateOrderOptions: CreateOrderObj = {
    intent: "CAPTURE",
    payer: {
      name: {
        given_name: parentData.firstName,
        surname: parentData.lastName,
      },
      email_address: parentData.email,
    },
    purchase_units: [
      {
        amount: {
          value: (
            totalPrice + Number(process.env.NEXT_PUBLIC_REGISTRATION_FEE)
          ).toFixed(2),
          currency_code: "USD",
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: (
                totalPrice + Number(process.env.NEXT_PUBLIC_REGISTRATION_FEE)
              ).toFixed(2),
            },
            discount: {
              currency_code: "USD",
              value: couponData ? (totalPrice / 2).toFixed(2) : "0.00",
            },
          },
        },
        invoice_id: "2",
        items: [
          ...itemsData,
          {
            name: "Registration Fee",
            unit_amount: {
              currency_code: "USD",
              value: String(process.env.NEXT_PUBLIC_REGISTRATION_FEE),
            },
            quantity: "1",
            sku: "1",
            category: "DIGITAL_GOODS",
          },
        ],
      },
    ],
    application_context: {
      brand_name: "Always Active Academy",
    },
  };

  (window as any).paypal
    .Buttons({
      createOrder: function (data, actions) {
        // This function sets up the details of the transaction, including the amount and line item details.
        return actions.order.create(paypalCreateOrderOptions);
      },
      onApprove: function (data, actions) {
        // This function captures the funds from the transaction.
        return actions.order.capture().then(function (details) {
          // Run stuff after successful payment
          onPaid();
        });
      },
      onError: function (error) {
        console.log(error);
      },
    })
    .render(paypal.current);
};
