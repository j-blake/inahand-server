import useragent from 'useragent';

import * as passwordService from './password';
import * as userFactory from '../model/factory/user';
import Identity from '../model/identity';
import { User } from '../@types/user';
import { UserAgent } from '../@types/userAgent';

export const findById = async (id: string): Promise<User> => {
  const identity = await Identity.findById(id).exec();
  return identity;
};

export const createUser = async (
  firstName: User['firstName'],
  lastName: User['lastName'],
  email: User['email'],
  hash: User['passwordHash']
): Promise<User | null> => {
  try {
    const identity = userFactory.createUser(firstName, lastName, email, hash);
    await identity.save();
    return identity;
  } catch (e) {
    // todo log error
    return null;
  }
};

export const findByAuthentication = async (
  email: User['email'],
  password: User['passwordHash']
): Promise<User | null> => {
  try {
    const identity = await Identity.findOne({ email }).exec();
    if (!identity) {
      return null;
    }
    const { passwordHash: hash } = identity;
    const isAuthenticated = await passwordService.authenticatePassword(
      password,
      hash
    );
    if (!isAuthenticated) {
      return null;
    }
    return identity;
  } catch (e) {
    // todo log exception
    return null;
  }
};

export const createUserAgentDocument = (
  agentHeader: string | undefined,
  remoteAddress: string | undefined
): UserAgent => {
  const agent = useragent.parse(agentHeader);
  return {
    agent: agent.toString(),
    os: agent.os.toString(),
    device: agent.device.toString(),
    ipAddress: remoteAddress ?? '',
  };
};
