import User from '../model/User.model'
import OT_CONFIG from '../config/ot_config'
import { Context } from 'koa';
import tokenUtils from '../../utils/token';
import { IResBody } from '../types';
import { FAIL_CODE, INSUFFICIENT_AUTHORITY} from '../constants';
import { Op } from 'sequelize';


class UserService {
    // 核对账户密码
    async findUserByUsernameAndPassword({ username, password }: { username: string, password: string }) {
        try {
            const user = await User.findOne({
                where: {
                    username,
                    password
                }
            });
            // 如果找到用户，则返回用户对象，否则返回 null
            return user ? user.dataValues : null
        } catch (error) {
            console.error('Error finding User:', error);
            return null
        }
    }

    // 初始化root用戶
    async initRootUser() {
        try {
            await User.bulkCreate([{
                username: OT_CONFIG.ROOT_USERNAME,
                password: OT_CONFIG.ROOT_PASSWORD,
                root_user_id: null
            }, {
                username: OT_CONFIG.TEST_ROOT_USERNAME,
                password: OT_CONFIG.TEST_ROOT_PASSWORD,
                root_user_id: null
            }]);
            console.log('The root_user was successfully initialized. Procedure.');
        } catch (error) {
            console.error('Description Failed to initialize the root_user:', error);
        }
    }

    // 判断当前用户是否处于disabled状态 null代表无此用户
    async checkUserStatusById(id: number): Promise<boolean | null> {
        try {
            const user = await User.findOne({
                attributes: ['disabled'],
                where: {
                    id
                }
            })
            // 如果找到用户，则返回用户对象，否则返回 null
            return user ? user.dataValues.disabled! : null
        } catch (error) {
            console.error(error);
            return null
        }
    }

    // 判断该root用户下的子用户名是否存在
    async checkIfUserExisted(root_user_id: number, username: string): Promise<boolean | null> {
        try {
            const user = await User.findOne({
                where: {
                    root_user_id,
                    username
                }
            })
            // 如果找到用户，则返回用户对象，否则返回 null
            return user ? true : false
        } catch (error) {
            console.error(error);
            return null
        }
    }

    // 判断该子用户是否被root用户所有
    async checkIfUserBelong2RootUser(root_user_id: number, id: number): Promise<boolean> {
        try {
            const user = await User.findOne({
                where: {
                    root_user_id,
                    id
                }
            })
            console.log(user);

            // 如果找到用户，则返回true，否则返回 false
            return user ? true : false
        } catch (error) {
            console.error(error);
            return false
        }
    }
    // 根据id查询指定用户，获取实例
    async getUserById(id: number): Promise<User | null> {
        try {
            const user = await User.findOne({
                where: {
                    id
                }
            })
            return user ? user : null
        } catch (error) {
            console.error(error);
            return null
        }
    }
}
export default new UserService
