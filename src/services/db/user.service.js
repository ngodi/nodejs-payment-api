import { BadRequestError } from '../../errors/error-handler.js';
import { UserModel } from '../../models/userModel.js';

class UserService {
  createUser = async (name, email) => {
    try {
      let user = await this.userExist(email);
      if (!user) {
        user = await UserModel.create({ name, email });
      }

      return user;
    } catch (error) {
      throw new BadRequestError(error.message);
    }
  };

  userExist = async (email) => {
    const user = await UserModel.findOne({ where: { email } });

    return user
  };
}

export const userService = new UserService();
