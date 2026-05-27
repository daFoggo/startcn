import {
	IconLoader2 as Loader2,
	IconLogin as LogIn,
} from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { SITE_CONFIG } from "@/configs/site";
import { getErrorMessage } from "@/lib/error";
import { useAuthMutations } from "../queries";
import { SignInSchema, type TSignInResponse } from "../schemas";
import { TelegramLoginButton } from "./telegram-login-button";

interface ISignInFormProps {
	redirect?: string;
}

/**
 * Form đăng nhập (Sign-in form) của hệ thống.
 * Xử lý việc validate dữ liệu người dùng và lưu trữ thông tin session sau khi đăng nhập thành công.
 */
export const SignInForm = ({ redirect }: ISignInFormProps) => {
	const navigate = useNavigate();
	const { signIn: signInMutation, signInWithTelegram } = useAuthMutations();

	const navigateAfterAuth = (response: TSignInResponse) => {
		if (!response.user_info.profile_completed) {
			navigate({ to: "/dashboard/overview" });
			return;
		}

		if (redirect) {
			try {
				const url = new URL(redirect, window.location.origin);
				if (url.origin === window.location.origin) {
					navigate({ to: url.pathname + url.search });
				} else {
					window.location.href = redirect;
				}
			} catch {
				navigate({ to: redirect });
			}
		} else {
			navigate({ to: "/dashboard" });
		}
	};

	const form = useForm({
		defaultValues: {
			email__eq: "",
			password: "",
		},
		validators: {
			onSubmit: SignInSchema,
		},
		onSubmit: async ({ value }) => {
			try {
				const response = await signInMutation.mutateAsync(value);
				// Lưu metadata thời gian hết hạn để dễ theo dõi phiên ở client.
				localStorage.setItem("expiration", response.expiration);
				localStorage.setItem("refresh_expiration", response.refresh_expiration);

				toast.success("Signed in successfully");
				navigateAfterAuth(response);
			} catch (error) {
				toast.error(
					getErrorMessage(error, "Sign in failed. Please try again."),
				);
				console.error(error);
			}
		},
	});

	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl font-semibold">
					Sign in to {SITE_CONFIG?.app?.title}
				</CardTitle>
				<div className="text-left text-sm text-muted-foreground">
					Don't have an account?{" "}
					<Link
						to="/auth/sign-up"
						className="font-medium text-primary transition-all duration-300 hover:underline hover:underline-offset-4"
					>
						Get started
					</Link>
				</div>
			</CardHeader>
			<CardContent>
				<div className="mb-5 space-y-4">
					<TelegramLoginButton
						isPending={signInWithTelegram.isPending}
						redirect={redirect}
						onError={(message) => toast.error(message)}
					/>
					<div className="flex items-center gap-3">
						<Separator className="flex-1" />
						<span className="text-xs text-muted-foreground">or</span>
						<Separator className="flex-1" />
					</div>
				</div>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();
						form.handleSubmit();
					}}
					className="space-y-4"
				>
					<FieldGroup className="gap-6">
						<form.Field
							name="email__eq"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched &&
									!!field.state.meta.errors.length;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Email</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="name@example.com"
											type="email"
											aria-invalid={isInvalid}
											autoComplete="username"
										/>
										<FieldError errors={field.state.meta.errors} />
									</Field>
								);
							}}
						/>

						<form.Field
							name="password"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched &&
									!!field.state.meta.errors.length;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>Password</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											type="password"
											aria-invalid={isInvalid}
											autoComplete="current-password"
										/>
										<FieldError errors={field.state.meta.errors} />
									</Field>
								);
							}}
						/>
					</FieldGroup>

					<form.Subscribe
						selector={(state) => [state.canSubmit, state.isSubmitting]}
						children={([canSubmit, isSubmitting]) => (
							<Button
								type="submit"
								className="w-full font-semibold"
								disabled={!canSubmit || isSubmitting}
							>
								{isSubmitting ? (
									<>
										<span>Processing...</span>
										<Loader2 className="size-4 animate-spin" />
									</>
								) : (
									<>
										<span>Sign in</span>
										<LogIn className="size-4" />
									</>
								)}
							</Button>
						)}
					/>
				</form>
			</CardContent>
		</Card>
	);
};
