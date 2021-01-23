export interface PaypalAddress {
  address_line_1?: string;
  address_line_2?: string;
  admin_area_2?: string;
  admin_area_1?: string;
  postal_code?: string;
  country_code: string;
}

export interface PaypalPayee {
  email_address?: string;
  merchant_id?: string;
}

export interface PaypalMoney {
  currency_code: CurrencyCode;
  value: string;
}

export interface CreateOrderObj {
  intent?: "CAPTURE" | "AUTHORIZE";
  payer?: {
    name?: {
      given_name?: string;
      surname?: string;
    };
    email_address?: string;
    payer_id?: string;
    phone?: {
      phone_type?: "FAX" | "HOME" | "MOBILE" | "OTHER" | "PAGER";
      phone_number: {
        national_number: string;
      };
    };
    birth_date?: string;
    tax_info?: {
      tax_id: string;
      tax_id_type: "BR_CPF" | "BR_CNPJ";
    };
    address?: PaypalAddress;
  };
  purchase_units: {
    reference_id?: string;
    amount: {
      currency_code: CurrencyCode;
      value: string;
      breakdown?: {
        item_total?: PaypalMoney;
        shipping?: PaypalMoney;
        handling?: PaypalMoney;
        tax_total?: PaypalMoney;
        insurance?: PaypalMoney;
        shipping_discount?: PaypalMoney;
        discount?: PaypalMoney;
      };
    };
    payee?: PaypalPayee;
    payment_instruction?: {
      platform_fees?: {
        amount: PaypalMoney;
        payee?: PaypalPayee;
      }[];
      disbursement_mode?: "INSTANT" | "DELAYED";
    };
    description?: string;
    custom_id?: string;
    invoice_id?: string;
    soft_descriptor?: string;
    items?: {
      name: string;
      unit_amount: PaypalMoney;
      tax?: PaypalMoney;
      quantity: string;
      description?: string;
      sku?: string;
      category?: "DIGITAL_GOODS" | "PHYSICAL_GOODS";
    }[];
    shipping?: {
      name: {
        full_name?: string;
      };
      address?: PaypalAddress;
    };
  }[];
  application_context?: {
    brand_name?: string;
    locale?: string;
    landing_page?: "LOGIN" | "BILLING" | "NO_PREFERENCE";
    shipping_preference?:
      | "GET_FROM_FILE"
      | "NO_SHIPPING"
      | "SET_PROVIDED_ADDRESS";
    user_action?: "CONTINUE" | "PAY_NOW";
    payment_method?: {
      payer_selected?: string;
      payee_preferred?: "UNRESTRICTED" | "IMMEDIATE_PAYMENT_REQUIRED";
      standard_entry_class_code?: "TEL" | "WEB" | "CCD" | "PPD";
    };
    return_url?: string;
    cancel_url?: string;
    stored_payment_source?: {
      payment_initiator: "CUSTOMER" | "MERCHANT";
      payment_type: "ONE_TIME" | "RECURRING" | "UNSCHEDULED";
      usage?: "FIRST" | "SUBSEQUENT" | "DERIVED";
      previous_network_transaction_reference?: {
        id: string;
        date?: string;
        network:
          | "VISA"
          | "MASTERCARD"
          | "DISCOVER"
          | "AMEX"
          | "SOLO"
          | "JCB"
          | "STAR"
          | "DELTA"
          | "SWITCH"
          | "MAESTRO"
          | "CB_NATIONALE"
          | "CONFIGOGA"
          | "CONFIDIS"
          | "ELECTRON"
          | "CETELEM"
          | "CHINA_UNION_PAY";
      };
    };
  };
}

type CurrencyCode =
  | "AUD"
  | "BRL"
  | "CAD"
  | "CNY"
  | "CZK"
  | "DKK"
  | "EUR"
  | "HKD"
  | "HUF"
  | "INR"
  | "ILS"
  | "JPY"
  | "MYR"
  | "MXN"
  | "TWD"
  | "NZD"
  | "NOK"
  | "PHP"
  | "PLN"
  | "GBP"
  | "RUB"
  | "SGD"
  | "SEK"
  | "CHF"
  | "THB"
  | "USD";