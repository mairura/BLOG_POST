import { UserEntity } from '@/user/user.entity';

export type IUser = Omit<UserEntity, 'hashPassword'>;
