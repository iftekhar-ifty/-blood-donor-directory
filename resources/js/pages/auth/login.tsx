import { Form, Head } from '@inertiajs/react';
import { Droplet } from 'lucide-react';
import InputError from '@/components/input-error';
import {
    inputClass,
    labelClass,
    primaryButtonClass,
} from '@/components/donor/form-styles';
import DonorPageHeader from '@/components/donor/donor-page-header';
import { register as registerRoute } from '@/routes';
import { store as loginStore } from '@/routes/login';

export default function Login() {
    return (
        <>
            <Head title="Login" />

            <div className="min-h-screen bg-page">
                <DonorPageHeader title="Login" />

                <div className="px-4 py-6">
                    <div className="mb-6 text-center">
                        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-blood-tint">
                            <Droplet className="h-8 w-8 fill-blood text-blood" aria-hidden="true" />
                        </div>
                        <h2 className="text-[20px] font-bold tracking-tight">
                            Welcome back
                        </h2>
                        <p className="mt-1 text-[13px] text-ink-soft">
                            Login to manage your donor profile
                        </p>
                    </div>

                    <Form
                        {...loginStore.form()}
                        resetOnSuccess={['password']}
                        className="space-y-3"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div>
                                    <label htmlFor="identifier" className={labelClass}>
                                        Phone Number / Username
                                    </label>
                                    <input
                                        id="identifier"
                                        type="text"
                                        name="identifier"
                                        required
                                        autoFocus
                                        autoComplete="username"
                                        placeholder="01XXXXXXXXX or username"
                                        className={`${inputClass} font-mono`}
                                    />
                                    <InputError message={errors.identifier} />
                                </div>

                                <div>
                                    <label htmlFor="password" className={labelClass}>
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        required
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        className={inputClass}
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className={primaryButtonClass}
                                >
                                    Login
                                </button>
                            </>
                        )}
                    </Form>

                    <div className="mt-4 flex items-center justify-between text-[12.5px]">
                        <a
                            href={registerRoute().url}
                            className="font-semibold text-blood hover:underline"
                        >
                            Create New Profile
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
