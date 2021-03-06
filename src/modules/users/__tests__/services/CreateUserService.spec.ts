import AppError from '@shared/errors/AppError';
import CreateUserService from '@modules/users/services/CreateUsersService';
import UserRepository from '@modules/users/repositories/fake/FakeUserRepository';
import FakeHashPovider from '@modules/users/infra/providers/hashProviders/fake/FakeHashProviderRepository';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fake/FakeCacheProvider';

const userData = {
  name: 'jhonnas',
  email: 'jhonas@gmail.com',
  password: '123456',
};

let userRepository: UserRepository;
let fakeHashPovider: FakeHashPovider;
let createUserService: CreateUserService;
let fakeCacheProvider: FakeCacheProvider;

describe('CreateUser', () => {
  beforeEach(() => {
    userRepository = new UserRepository();
    fakeHashPovider = new FakeHashPovider();
    fakeCacheProvider = new FakeCacheProvider();
    createUserService = new CreateUserService(
      userRepository,
      fakeHashPovider,
      fakeCacheProvider,
    );
  });
  it('should be able to create a new user', async () => {
    const user = await createUserService.execute(userData);

    expect(user).toHaveProperty('id');
    expect(user.avatar).toBeUndefined();
    expect(user.email).toBe('jhonas@gmail.com');
    expect(user.name).toBe('jhonnas');
  });

  it('should not be albe create a new user with same the email', async () => {
    await createUserService.execute(userData);
    expect(createUserService.execute(userData)).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
