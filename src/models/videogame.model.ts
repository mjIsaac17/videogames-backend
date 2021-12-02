import moongose from "mongoose";

export interface IVideogame extends moongose.Document {
  name: string;
  description: string;
  releaseDate: Date;
  companies: Array<moongose.Types.ObjectId>;
  consoles: Array<moongose.Types.ObjectId>;
  image: Buffer;
  imageType: string;
}

const VideogameSchema = new moongose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    releaseDate: { type: Date, required: true },
    companies: [
      {
        type: moongose.Types.ObjectId,
        required: true,
        ref: "Company",
      },
    ],
    consoles: [
      {
        type: moongose.Types.ObjectId,
        required: true,
        ref: "Console",
      },
    ],
    image: { type: Buffer, required: true },
    imageType: { type: String, required: true },
    active: { type: Boolean, required: false, default: true },
  },
  { timestamps: true }
);

VideogameSchema.method("toJSON", function () {
  const { __v, createdAt, updatedAt, ...object } = this.toObject();
  return object;
});

export default moongose.model<IVideogame>("Videogame", VideogameSchema);
