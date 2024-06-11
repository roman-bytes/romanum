import { getFormProps, getInputProps, useForm } from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import {
	json,
	type ActionFunctionArgs,
	type LoaderFunctionArgs,
	type MetaFunction,
} from '@remix-run/node'
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react'
import { HoneypotInputs } from 'remix-utils/honeypot/react'
import { z } from 'zod'
import { GeneralErrorBoundary } from '#app/components/error-boundary.tsx'
import { CheckboxField, ErrorList, Field } from '#app/components/forms.tsx'
import { Spacer } from '#app/components/spacer.tsx'
import { StatusButton } from '#app/components/ui/status-button.tsx'
import { login, requireAnonymous } from '#app/utils/auth.server.ts'
import { checkHoneypot } from '#app/utils/honeypot.server.ts'
import { useIsPending } from '#app/utils/misc.tsx'
import { PasswordSchema, UsernameSchema } from '#app/utils/user-validation.ts'
import { handleNewSession } from './login.server.ts'

const LoginFormSchema = z.object({
	username: UsernameSchema,
	password: PasswordSchema,
	redirectTo: z.string().optional(),
	remember: z.boolean().optional(),
})

export async function loader({ request }: LoaderFunctionArgs) {
	await requireAnonymous(request)
	return json({})
}

export async function action({ request }: ActionFunctionArgs) {
	await requireAnonymous(request)
	const formData = await request.formData()
	checkHoneypot(formData)
	const submission = await parseWithZod(formData, {
		schema: intent =>
			LoginFormSchema.transform(async (data, ctx) => {
				if (intent !== null) return { ...data, session: null }

				const session = await login(data)
				if (!session) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						message: 'Invalid username or password',
					})
					return z.NEVER
				}

				return { ...data, session }
			}),
		async: true,
	})

	if (submission.status !== 'success' || !submission.value.session) {
		return json(
			{ result: submission.reply({ hideFields: ['password'] }) },
			{ status: submission.status === 'error' ? 400 : 200 },
		)
	}

	const { session, remember } = submission.value

	return handleNewSession({
		request,
		session,
		remember: remember ?? false,
		redirectTo: '/posts',
	})
}

export default function LoginPage() {
	const actionData = useActionData<typeof action>()
	const isPending = useIsPending()
	const [searchParams] = useSearchParams()
	const redirectTo = searchParams.get('redirectTo')

	const [form, fields] = useForm({
		id: 'login-form',
		constraint: getZodConstraint(LoginFormSchema),
		defaultValue: { redirectTo },
		lastResult: actionData?.result,
		onValidate({ formData }) {
			return parseWithZod(formData, { schema: LoginFormSchema })
		},
		shouldRevalidate: 'onBlur',
	})

	return (
		<div className="flex min-h-full flex-col justify-center pb-32 pt-20">
			<div className="mx-auto w-full max-w-md">
				<div className="flex flex-col gap-3 text-center">
					<svg width="100%" height="100%" viewBox="0 0 530 123" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path fillRule="evenodd" clipRule="evenodd"
							  d="M67.9714 8.94545H0V0H67.9714C76.0953 -2.66595e-06 86.4002 1.25588 94.8105 6.41522C103.571 11.7893 109.757 21.0935 109.757 35.7818C109.757 50.5204 103.383 59.4035 95.0768 64.2573C94.8864 64.3686 94.6952 64.4777 94.5033 64.5844C95.3077 65.0281 96.1038 65.5153 96.8873 66.0502C105.943 72.2333 112.129 83.9061 111.426 104.147L111.421 104.276C111.376 105.562 111.334 106.753 111.667 107.775C111.81 108.216 111.978 108.452 112.127 108.593C112.252 108.711 112.562 108.953 113.34 109.095L117 109.763V123H70.7571V118.527C70.7571 112.2 70.6968 107.073 70.2086 102.836C69.7204 98.5985 68.8453 95.6965 67.5143 93.6282C65.3982 90.3399 61.208 87.8546 50.7 87.3237V98.4H60.7286V107.345H8.91429V114.055H60.7286V123H0V98.4H10.0286V24.0409H0V15.0955H18.9429V98.4H25.9071V15.0955H34.8214V98.4H41.7857V15.0955H60.7286V24.0409H50.7V78.3681C62.4817 78.9014 70.479 81.7456 75.0028 88.7753C77.4047 92.5075 78.5074 96.9785 79.0639 101.809C79.4843 105.458 79.6163 109.567 79.6556 114.055H105.05C104.147 112.921 103.566 111.697 103.193 110.55C102.338 107.924 102.457 105.214 102.506 104.093C102.511 103.994 102.514 103.908 102.517 103.835C103.151 85.6103 97.6367 77.3816 91.8727 73.4462C87.449 70.4258 82.2125 69.4483 77.6238 69.259C75.6277 69.3927 73.7967 69.3931 72.2295 69.3228L72.1633 60.3898C73.6686 60.2997 75.4776 60.2379 77.4836 60.3008C81.6698 59.9725 86.474 58.9328 90.591 56.527C96.0739 53.3231 100.843 47.4323 100.843 35.7818C100.843 24.0811 96.1649 17.7307 90.161 14.0475C83.8069 10.1496 75.4476 8.94545 67.9714 8.94545Z"
							  fill="#232B20"/>
						<path
							d="M498.469 91H496.75L481.281 55.5938V87.875L486.906 88.7188V91H472V88.7188L477.375 87.875V52.1875L472 51.375V49.0938H488.469L500.438 76.6562L512.656 49.0938H529.469V51.375L524.094 52.1875V87.875L529.469 88.7188V91H508.625V88.7188L514.25 87.875V55.5938L498.469 91Z"
							fill="#F2F2F4"/>
						<path
							d="M450.844 87.1875C453.969 87.1875 456.385 86.3125 458.094 84.5625C459.802 82.8125 460.656 80.2396 460.656 76.8438V52.1875L455.031 51.375V49.0938H469.281V51.375L464.531 52.1875V76.5938C464.531 81.4271 463.135 85.1354 460.344 87.7188C457.552 90.3021 453.562 91.5938 448.375 91.5938C442.771 91.5938 438.469 90.2917 435.469 87.6875C432.49 85.0625 431 81.2812 431 76.3438V52.1875L426.25 51.375V49.0938H446.219V51.375L440.844 52.1875V76.7812C440.844 80.1354 441.688 82.7083 443.375 84.5C445.083 86.2917 447.573 87.1875 450.844 87.1875Z"
							fill="#F2F2F4"/>
						<path
							d="M414.5 52.1875L408.875 51.375V49.0938H423.781V51.375L418.406 52.1875V91H414.75L388.906 57.3125V87.875L394.531 88.7188V91H379.625V88.7188L385 87.875V52.1875L379.625 51.375V49.0938H393.969L414.5 75.875V52.1875Z"
							fill="#F2F2F4"/>
						<path
							d="M345.531 88.7188V91H332.781V88.7188L335.906 87.875L350.812 48.75H359.875L374.719 87.875L377.906 88.7188V91H359.25V88.7188L364.094 87.875L360.094 77.0312H344L340.156 87.875L345.531 88.7188ZM352.188 55.0625L345.281 73.5938H358.906L352.188 55.0625Z"
							fill="#F2F2F4"/>
						<path
							d="M299.281 91H297.562L282.094 55.5938V87.875L287.719 88.7188V91H272.812V88.7188L278.188 87.875V52.1875L272.812 51.375V49.0938H289.281L301.25 76.6562L313.469 49.0938H330.281V51.375L324.906 52.1875V87.875L330.281 88.7188V91H309.438V88.7188L315.062 87.875V55.5938L299.281 91Z"
							fill="#F2F2F4"/>
						<path
							d="M235.406 70C235.406 76.6458 236.312 81.3958 238.125 84.25C239.958 87.0833 242.854 88.5 246.812 88.5C250.75 88.5 253.625 87.0729 255.438 84.2188C257.271 81.3646 258.188 76.625 258.188 70C258.188 63.3958 257.271 58.7083 255.438 55.9375C253.625 53.1667 250.75 51.7812 246.812 51.7812C242.854 51.7812 239.958 53.1667 238.125 55.9375C236.312 58.7083 235.406 63.3958 235.406 70ZM225.031 70C225.031 55.75 232.292 48.625 246.812 48.625C253.979 48.625 259.396 50.4375 263.062 54.0625C266.729 57.6667 268.562 62.9792 268.562 70C268.562 77.1042 266.708 82.4896 263 86.1562C259.292 89.8021 253.896 91.625 246.812 91.625C239.75 91.625 234.354 89.8021 230.625 86.1562C226.896 82.5104 225.031 77.125 225.031 70Z"
							fill="#F2F2F4"/>
						<path
							d="M192 73.25V87.875L197.375 88.7188V91H177.156V88.7188L182.125 87.875V52.1875L176.75 51.375V49.0938H196.781C202.948 49.0938 207.552 50.0417 210.594 51.9375C213.635 53.8333 215.156 56.7917 215.156 60.8125C215.156 66.8125 212.344 70.6667 206.719 72.375L217.906 87.875L222.438 88.7188V91H208.875L197.188 73.25H192ZM205.406 60.875C205.406 57.75 204.76 55.5833 203.469 54.375C202.177 53.1458 199.812 52.5312 196.375 52.5312H192V69.8125H196.531C199.74 69.8125 202.021 69.1458 203.375 67.8125C204.729 66.4792 205.406 64.1667 205.406 60.875Z"
							fill="#F2F2F4"/>
					</svg>
					<h1 className="font-tinos text-h1 mt-6">Welcome back!</h1>
					<p className="text-body-md text-muted-foreground">
						Please enter your details.
					</p>
				</div>
				<Spacer size="xs"/>

				<div>
					<div className="mx-auto w-full max-w-md px-8">
						<Form method="POST" {...getFormProps(form)}>
							<HoneypotInputs/>
							<Field
								labelProps={{children: 'Username'}}
								inputProps={{
									...getInputProps(fields.username, {type: 'text'}),
									autoFocus: true,
									className: 'lowercase',
									autoComplete: 'username',
								}}
								errors={fields.username.errors}
							/>

							<Field
								labelProps={{children: 'Password'}}
								inputProps={{
									...getInputProps(fields.password, {
										type: 'password',
									}),
									autoComplete: 'current-password',
								}}
								errors={fields.password.errors}
							/>

							<div className="flex justify-between">
								<CheckboxField
									labelProps={{
										htmlFor: fields.remember.id,
										children: 'Remember me',
									}}
									buttonProps={getInputProps(fields.remember, {
										type: 'checkbox',
									})}
									errors={fields.remember.errors}
								/>
								<div>
									<Link
										to="/forgot-password"
										className="text-body-xs font-semibold"
									>
										Forgot password?
									</Link>
								</div>
							</div>

							<input
								{...getInputProps(fields.redirectTo, {type: 'hidden'})}
							/>
							<ErrorList errors={form.errors} id={form.errorId}/>

							<div className="flex items-center justify-between gap-6 pt-3">
								<StatusButton
									className="w-full"
									status={isPending ? 'pending' : form.status ?? 'idle'}
									type="submit"
									disabled={isPending}
								>
									Log in
								</StatusButton>
							</div>
						</Form>
					</div>
				</div>
			</div>
		</div>
	)
}

export const meta: MetaFunction = () => {
	return [{title: 'Login to Romanum'}]
}

export function ErrorBoundary() {
	return <GeneralErrorBoundary/>
}
