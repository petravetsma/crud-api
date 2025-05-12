import { IncomingMessage, ServerResponse } from 'http';

import { validate as isValidUUID } from 'uuid';
import {
    getRequestBody,
    getUserId,
    responseErrors,
    setResp,
} from './utils';
import { User } from './User';
import { getUserByIdController, getUsersController, addUserController, updateUserController, deleteUserController } from './controller';

const USER_ENDPOINT = '/api/users';

export const router = async (
    req: IncomingMessage,
    res: ServerResponse,
): Promise<void> => {
    const { url, method } = req;

    try {
        if (!url || !method) {
            return setResp(res, responseErrors.MNA());
        }

        if (!url.startsWith(USER_ENDPOINT)) {
            return setResp(res, responseErrors.ENF());
        }

        const userId = getUserId(url);
        if (userId && !isValidUUID(userId!)) {
            return setResp(res, responseErrors.BAD_ID());
        }

        const body = ['POST', 'PUT'].includes(method)
            ? await getRequestBody(req)
            : undefined;

            switch (method) {
                case 'GET':
                  if (userId) {
                    setResp(res, getUserByIdController(userId));
                  } else {
                    setResp(res, getUsersController());
                  }
                  break;
                case 'POST':
                  setResp(res, addUserController(body as Omit<User, 'id'>));
                  break;
                case 'PUT':
                  setResp(res, updateUserController(userId!, body! as User));
                  break;
                case 'DELETE':
                  setResp(res, deleteUserController(userId!));
                  break;
                default:
                  setResp(res, responseErrors.MNA());
              }

    } catch {
        setResp(res, responseErrors.ISE());
    }
};
