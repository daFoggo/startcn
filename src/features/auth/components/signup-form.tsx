import { useForm } from "@tanstack/react-form";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Loader2 } from "lucide-react";
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
import { SITE_CONFIG } from "@/configs/site";
import { getErrorMessage } from "@/lib/error";
import { useAuthMutations } from "../queries";
import {
	SignUpFormSchema,
	type TSignUpFormInput,
	type TSignUpInput,
} from "../schemas";

export const SignUpForm = () => {
	const navigate = useNavigate();
	const { signUp: signUpMutation } = useAuthMutations();

	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
			confirmPassword: "",
			avatar_url: "",
		} as TSignUpFormInput,
		validators: {
			onSubmit: SignUpFormSchema,
		},
		onSubmit: async ({ value }) => {
			const { avatar_url, confirmPassword, ...rest } = value;
			const data: TSignUpInput = {
				...rest,
				avatar_url: avatar_url || undefined,
			};
			try {
				await signUpMutation.mutateAsync(data);
				toast.success("Registration successful! Please sign in.");
				navigate({ to: "/auth/sign-in" });
			} catch (error) {
				console.error("Mutation failed:", error);
				toast.error(
					getErrorMessage(error, "Registration failed. Please try again."),
				);
			}
		},
	});

	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl font-semibold">
					Get started with {SITE_CONFIG?.app?.title}
				</CardTitle>
				<div className="text-left text-sm text-muted-foreground">
					Already have an account?{" "}
					<Link
						to="/auth/sign-in"
						className="font-medium text-primary transition-all duration-300 hover:underline hover:underline-offset-4"
					>
						Sign in
					</Link>
				</div>
			</CardHeader>
			<CardContent>
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
							name="name"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched &&
									!!field.state.meta.errors.length;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>User name</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											placeholder="John Doe"
											aria-invalid={isInvalid}
											autoComplete="name"
										/>
										<FieldError errors={field.state.meta.errors} />
									</Field>
								);
							}}
						/>

						<form.Field
							name="email"
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
											autoComplete="new-password"
										/>
										<FieldError errors={field.state.meta.errors} />
									</Field>
								);
							}}
						/>

						<form.Field
							name="confirmPassword"
							children={(field) => {
								const isInvalid =
									field.state.meta.isTouched &&
									!!field.state.meta.errors.length;
								return (
									<Field data-invalid={isInvalid}>
										<FieldLabel htmlFor={field.name}>
											Confirm password
										</FieldLabel>
										<Input
											id={field.name}
											name={field.name}
											value={field.state.value}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											type="password"
											aria-invalid={isInvalid}
											autoComplete="new-password"
										/>
										<FieldError errors={field.state.meta.errors} />
									</Field>
								);
							}}
						/>
					</FieldGroup>

					<p className="text-xs text-muted-foreground">
						By signing up, you agree to{" "}
						<Link
							to="/"
							className="font-medium transition-all duration-300 hover:underline hover:underline-offset-4"
						>
							Terms & Conditions
						</Link>{" "}
						and{" "}
						<Link
							to="/"
							className="font-medium transition-all duration-300 hover:underline hover:underline-offset-4"
						>
							Privacy Policy
						</Link>
						.
					</p>

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
										<span>Sign up</span>
										<ArrowRight className="size-4" />
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
