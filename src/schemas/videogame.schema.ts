import { object, string, date, array } from "yup";
import { isValidObjectId } from "mongoose";

export const createVideogameSchema = object({
  body: object({
    name: string().required("Name is required"),
    description: string().notRequired(),
    releaseDate: date().required("Release date is required"),
    companies: array().of(
      string().test("is-mongo-id", "Invalid company id", (text) => {
        if (isValidObjectId(text)) return true;
        else return false;
      })
    ),
    consoles: array().of(
      string().test("is-mongo-id", "Invalid console id", (text) => {
        if (isValidObjectId(text)) return true;
        else return false;
      })
    ),
    image: string().notRequired(),
  }),
});

export const updateVideogameSchema = object({
  body: object({
    name: string().test("empty-check", "A valid name is required", (text) => {
      if (text === "") return false;
      else return true;
    }),
    description: string().notRequired(),
    releaseDate: date().required("Release date is required"),
    companies: array().of(
      string().test("is-mongo-id", "Invalid company id", (text) => {
        if (isValidObjectId(text)) return true;
        else return false;
      })
    ),
    consoles: array().of(
      string().test("is-mongo-id", "Invalid console id", (text) => {
        if (isValidObjectId(text)) return true;
        else return false;
      })
    ),
    image: string().notRequired(),
  }),
});
