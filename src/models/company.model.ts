import moongose from "mongoose";

export interface ICompany extends moongose.Document {
  name: string;
  shortDescription: string;
  description: string;
  image: Buffer;
  imageType: string;
}

const CompanySchema = new moongose.Schema(
  {
    name: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: false },
    description: { type: String, required: false },
    image: { type: Buffer, required: false },
    imageType: { type: String, required: false },
    active: { type: Boolean, required: false, default: true },
  },
  { timestamps: true }
);

CompanySchema.method("toJSON", function () {
  const { __v, createdAt, updatedAt, ...object } = this.toObject();
  return object;
});

export default moongose.model<ICompany>("Company", CompanySchema);
