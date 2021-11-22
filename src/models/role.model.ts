import moongose from "mongoose";

export interface IRole extends moongose.Document {
  name: string;
}

const RoleSchema = new moongose.Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

RoleSchema.method("toJSON", function () {
  const { __v, createdAt, updatedAt, ...object } = this.toObject();
  return object;
});

export default moongose.model<IRole>("Role", RoleSchema);
