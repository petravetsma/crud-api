import { v4 as uuidv4 } from 'uuid';
import { User } from './User';

import { isValidUserData, responseErrors, ResponseError as ResponseError, ResponseSuccess as ResponseSuccess, responseSuccess } from './utils';

const users: User[] = [];

export const getUsers = (): ResponseSuccess<User[]> =>
  responseSuccess.OK(users);

export const getUserById = (
  id: string,
): ResponseSuccess<User> | ResponseError => {
  const user = users.find((user) => user.id === id);
  return user ? responseSuccess.OK(user) : responseErrors.NF();
};

export const addUser = (
  body: unknown,
): ResponseSuccess<User> | ResponseError => {
  if (!isValidUserData(body)) {
    return responseErrors.MRF();
  }

  const { username, age, hobbies } = body;

  const newUser: User = { id: uuidv4(), username, age, hobbies };
  users.push(newUser);

  return responseSuccess.CREATE(newUser);
};

export const updateUser = (
  id: string,
  body: unknown,
): ResponseSuccess<User> | ResponseError => {
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) {
    return responseErrors.NF();
  }

  if (!isValidUserData(body)) {
    return responseErrors.MRF();
  }

  const { username, age, hobbies } = body;
  users[index] = { id, username, age, hobbies };
  return responseSuccess.OK(users[index]);
};

export const deleteUser = (
  id: string,
): ResponseSuccess<undefined> | ResponseError => {
  const index = users.findIndex((user) => user.id === id);
  if (index === -1) {
    return responseErrors.NF();
  }
  users.splice(index, 1);
  return responseSuccess.DELETE();
};
