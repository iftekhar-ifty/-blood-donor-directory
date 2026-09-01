import { Head, Link } from '@inertiajs/react';
import { Droplet } from 'lucide-react';
import { login as loginRoute, register as registerRoute } from '@/routes';
import { primaryButtonClass } from '@/components/donor/form-styles';

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />

            <div className="flex min-h-screen flex-col justify-between bg-white px-6 pb-8 pt-10">
                <div className="flex items-center gap-2">
                    <Droplet className="h-7 w-7 fill-blood text-blood" aria-hidden="true" />
                    <span className="text-[16px] font-bold tracking-tight">
                        Rokto Bondhu
                    </span>
                </div>

                <div className="mx-auto flex max-w-[300px] flex-col items-center text-center">
                    <div className="relative mb-10">
                        <div className="animate-pulse-ring absolute inset-0 rounded-full border-2 border-blood" />
                        <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-blood-tint">
                            <Droplet className="h-14 w-14 fill-blood text-blood" aria-hidden="true" />
                        </div>
                    </div>

                    <h1 className="text-[28px] font-bold leading-[1.15] tracking-tight text-ink">
                        Blood donors,
                        <br />
                        one tap away.
                    </h1>
                    <p className="mt-3.5 px-2 text-[14.5px] leading-relaxed text-ink-soft">
                        Register as a donor. Help someone in your area find the
                        right blood group when they need it most.
                    </p>
                </div>

                <div className="space-y-2">
                    <Link href={registerRoute().url} className={`${primaryButtonClass} block text-center`}>
                        Become a Donor
                    </Link>
                    <Link
                        href={loginRoute().url}
                        className="block w-full py-2.5 text-center text-[14px] font-medium text-ink"
                    >
                        Already have an account?{' '}
                        <span className="font-semibold text-blood">Login</span>
                    </Link>
                </div>
            </div>
        </>
    );
}
