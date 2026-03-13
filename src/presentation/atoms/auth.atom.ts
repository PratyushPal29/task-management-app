import { atom } from 'jotai';
import { UserEntity } from '../../domain/entities/user.entity';

// Core auth state atoms (Riverpod-style)
export const authUserAtom = atom<UserEntity | null>(null);
export const authLoadingAtom = atom<boolean>(true);
export const authErrorAtom = atom<string | null>(null);
export const authInitializedAtom = atom<boolean>(false);
