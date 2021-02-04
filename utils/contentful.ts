import * as contentful from "contentful";
import * as contentfulManagement from "contentful-management";

const contentfulClient = contentful.createClient({
  space: "xy48kwi10upb",
  accessToken: "fqFHm6ugDydTIFkovZII8YJiLn8lQs2Z9PihZCGITV8",
});

const contentfulAdmin = contentfulManagement.createClient({
  accessToken: "CFPAT-_aNIG4ExzQfCmSPu_y0vGaABNJcCB_FLCQNdc4kV6sk",
});

export { contentfulClient, contentfulAdmin };
