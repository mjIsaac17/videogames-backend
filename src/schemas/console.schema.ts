import { object, string, date } from "yup";
import { isValidObjectId } from "mongoose";

export const createConsoleSchema = object({
  body: object({
    name: string().required("Name is required"),
    description: string().notRequired(),
    releaseDate: date().required("Release data is required"),
    companyId: string().test(
      "is-mongo-id",
      "A valid company id is required",
      (text) => {
        if (isValidObjectId(text)) return true;
        else return false;
      }
    ),
    image: string().notRequired(),
  }),
});

export const updateConsoleSchema = object({
  body: object({
    name: string().test("empty-check", "A valid name is required", (text) => {
      if (text === "") return false;
      else return true;
    }),
    description: string().notRequired(),
    releaseDate: date().required("Release data is required"),
    companyId: string().test(
      "is-mongo-id",
      "A valid company id is required",
      (text) => {
        if (isValidObjectId(text)) return true;
        else return false;
      }
    ),
    image: string().notRequired(),
  }),
});
