import { object, string } from "yup";

export const createCompanySchema = object({
  body: object({
    name: string().required("Name is required"),
    description: string().notRequired(),
    image: string().notRequired(),
  }),
});

export const updateCompanySchema = object({
  body: object({
    name: string().test("empty-check", "A valid name is required", (text) => {
      if (text === "") return false;
      else return true;
    }),
    description: string().notRequired(),
    image: string().notRequired(),
  }),
});
