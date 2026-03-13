import { UserEntity } from '../entities/user.entity';

export interface AuthRepository {
  login(email: string, password: string): Promise<UserEntity>;
  register(email: string, password: string): Promise<UserEntity>;
  logout(): Promise<void>;
  getCurrentUser(): UserEntity | null;
  onAuthStateChanged(callback: (user: UserEntity | null) => void): () => void;
}
