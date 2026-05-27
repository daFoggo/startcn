import { z } from "zod";
import { UserSchema } from "../users";

export const SignInSchema = z.object({
	email__eq: z.email(),
	password: z.string().min(6),
});

export const SignInResponseSchema = z.object({
	access_token: z.string(),
	expiration: z.string(),
	refresh_token: z.string(),
	refresh_expiration: z.string(),
	user_info: UserSchema,
});

export const RefreshTokenInputSchema = z.object({
	refresh_token: z.string(),
});

export const TokenResponseSchema = z.object({
	access_token: z.string(),
	expiration: z.string(),
	refresh_token: z.string(),
	refresh_expiration: z.string(),
});

export const SignUpSchema = z.object({
	email: z.email(),
	password: z.string().min(6),
	name: z.string().min(3),
	avatar_url: z.url().optional().or(z.literal("")),
});

export const SignUpFormSchema = SignUpSchema.extend({
	confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
	message: "Passwords must match",
	path: ["confirmPassword"],
});

export const SignUpResponseSchema = UserSchema;

export const TelegramLoginPayloadSchema = z.object({
	id: z.string().optional(),
	auth_date: z.string().optional(),
	hash: z.string().optional(),
	id_token: z.string().optional(),
	code: z.string().optional(),
	redirect_uri: z.string().url().optional(),
	code_verifier: z.string().optional(),
	first_name: z.string().optional(),
	last_name: z.string().optional(),
	username: z.string().optional(),
	photo_url: z.string().optional(),
	phone_number: z.string().optional(),
});

export type TSignInInput = z.infer<typeof SignInSchema>;
export type TSignInResponse = z.infer<typeof SignInResponseSchema>;
export type TSignUpInput = z.infer<typeof SignUpSchema>;
export type TSignUpFormInput = z.infer<typeof SignUpFormSchema>;
export type TSignUpResponse = z.infer<typeof SignUpResponseSchema>;
export type TRefreshTokenInput = z.infer<typeof RefreshTokenInputSchema>;
export type TTokenResponse = z.infer<typeof TokenResponseSchema>;
export type TTelegramLoginPayload = z.infer<typeof TelegramLoginPayloadSchema>;
