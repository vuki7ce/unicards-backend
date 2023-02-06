import mongoose, { Model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

export interface User {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  photo: string;
  password: string;
  passwordConfirm: string;
  passwordChangedAt: Date;
}

interface UserMethods {
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
}

type UserModel = Model<User, {}, UserMethods>;

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'A user must have a first name!'],
  },
  lastName: {
    type: String,
    required: [true, 'A user must have a last name!'],
  },
  username: {
    type: String,
    required: [true, 'A user must have a username!'],
    unique: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: [true, 'A user must have an email!'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Email is not valid!'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'A user must have a password!'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password!'],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (this: { password: string }, el: string) {
        return el === this.password;
      },
      message: 'Passwords are not the same!',
    },
  },
  passwordChangedAt: Date,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined as unknown as string;
});

userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (!this.passwordChangedAt) return false;

  const changedTimeStamp = parseInt(
    `${this.passwordChangedAt.getTime() / 1000}`,
    10
  );
  return JWTTimestamp < changedTimeStamp;
};

const User = mongoose.model<User, UserModel>('User', userSchema);

export default User;
