import moongose from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends moongose.Document {
  email: String;
  name: String;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new moongose.Schema(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Encrypt password before saving the user
UserSchema.pre("save", function (next) {
  const user = this as IUser;

  // Only hash the password if it has been modified (or is new)
  if (!user.isModified("password")) return next();

  // Random additional data
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync(user.password, salt);

  // Replace the password with the hash
  user.password = hash;

  return next();
});

// Used for logging in
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this as IUser;
  return bcrypt
    .compare(candidatePassword, user.password)
    .catch((error) => false);
};

UserSchema.method("toJSON", function () {
  const { __v, password, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

export default moongose.model<IUser>("User", UserSchema);
