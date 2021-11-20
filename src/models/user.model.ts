import moongose from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';

export interface UserDocument extends moongose.Document {
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
        password: { type: String, required: true }
    },
    { timestamps: true }
);

UserSchema.pre("save", function (next) {
    const user = this as UserDocument;

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // Random additional data
    const salt = bcrypt.genSaltSync(config.get('saltWorkFactor'));
    const hash = bcrypt.hashSync(user.password, salt);

    // Replace the password with the hash
    user.password = hash;

    return next();
});

// Used for logging in
UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    const user = this as UserDocument;
    return bcrypt.compare(candidatePassword, user.password).catch(error => false);
}

UserSchema.method("toJSON", function () {
    const { __v, password, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

export default moongose.model<UserDocument>("User", UserSchema);