import { object, string } from "yup";

export const createCompanySchema = object({
  body: object({
    name: string().required("Name is required"),
    description: string().notRequired(),
    image: string().notRequired(),
  }),
});
