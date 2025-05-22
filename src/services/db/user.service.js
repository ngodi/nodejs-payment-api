import { BadRequestError } from '../../errors/error-handler';
import { UserModel } from '../../models/userModel';

class UserService {
  createUser = async (name, email) => {
    try {
      const user = await UserModel.create({ name, email });

      return user;
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  };

  userExist = async (email) => {
    try {
      const response = await UserModel.findOne({ where: { email } });

      if (response) {
        return true;
      }
      return false;
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  };
}

export const userService = new UserService();
