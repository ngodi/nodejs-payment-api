import { BadRequestError } from "../../errors/error-handler";
import { UserModel } from "../../models/userModel"

export const createUser = async (name, email) => {
  try {
    const user = await UserModel.create({name, email});

    return user;
  } catch (error) {
    throw new BadRequestError(error.message);
  }
}

export const userExist = async (email) => {
  try {
    const response = await UserModel.findOne({ where: { email } });

  if (response) {
    return true;
  }
  return false;
  } catch (error) {
    throw new BadRequestError(error.message);
  }
}