import {
  getUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
} from './store';

export const getUsersController = () => getUsers();

export const getUserByIdController = (id: string) => getUserById(id);

export const addUserController = (body: unknown) => addUser(body);

export const updateUserController = (id: string, body: unknown) =>
  updateUser(id, body);

export const deleteUserController = (id: string) => deleteUser(id);
