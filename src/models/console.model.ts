import moongose from "mongoose";

export interface IConsole extends moongose.Document {
  name: string;
  description: string;
  releaseDate: Date;
  companyId: moongose.Types.ObjectId;
  image: string;
}

const ConsoleSchema = new moongose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    releaseDate: { type: Date, required: true },
    companyId: {
      type: moongose.Types.ObjectId,
      required: true,
      ref: "Company",
    },
    image: { type: String, required: false },
  },
  { timestamps: true }
);

ConsoleSchema.method("toJSON", function () {
  const { __v, createdAt, updatedAt, ...object } = this.toObject();
  return object;
});

export default moongose.model<IConsole>("Console", ConsoleSchema);
