import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	signInFn,
	signInWithTelegramFn,
	signOutFn,
	signUpFn,
} from "./functions";
import type {
	TSignInInput,
	TSignUpInput,
	TTelegramLoginPayload,
} from "./schemas";

export const useAuthMutations = () => {
	const queryClient = useQueryClient();

	const signIn = useMutation({
		mutationFn: (variables: TSignInInput) => signInFn({ data: variables }),
		onSuccess: () => {
			queryClient.clear();
		},
	});

	const signInWithTelegram = useMutation({
		mutationFn: (variables: TTelegramLoginPayload) =>
			signInWithTelegramFn({ data: variables }),
		onSuccess: () => {
			queryClient.clear();
		},
	});

	const signUp = useMutation({
		mutationFn: (variables: TSignUpInput) => signUpFn({ data: variables }),
	});

	const signOut = useMutation({
		mutationFn: () => signOutFn(),
		onSuccess: () => {
			queryClient.clear();
		},
	});

	return { signIn, signInWithTelegram, signUp, signOut };
};
