import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../../core/config/firebase';
import { UserEntity } from '../../domain/entities/user.entity';
import { AuthRepository } from '../../domain/repositories/auth.repository';

function mapUser(user: { uid: string; email: string | null; displayName: string | null }): UserEntity {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  };
}

export class FirebaseAuthRepositoryImpl implements AuthRepository {
  async login(email: string, password: string): Promise<UserEntity> {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return mapUser(credential.user);
  }

  async register(email: string, password: string): Promise<UserEntity> {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    return mapUser(credential.user);
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }

  getCurrentUser(): UserEntity | null {
    const user = auth.currentUser;
    return user ? mapUser(user) : null;
  }

  onAuthStateChanged(callback: (user: UserEntity | null) => void): () => void {
    return firebaseOnAuthStateChanged(auth, user => {
      callback(user ? mapUser(user) : null);
    });
  }
}

export const authRepository = new FirebaseAuthRepositoryImpl();
