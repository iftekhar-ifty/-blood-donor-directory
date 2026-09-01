import { usePage } from '@inertiajs/react';
import { Droplet, Search, Clock, UserRound } from 'lucide-react';
import { index as donorsRoute } from '@/routes/donors';
import { donations as myDonationsRoute } from '@/routes/donor/profile';
import { show as profileRoute } from '@/routes/donor/profile';
import { cn } from '@/lib/utils';

type NavItem = {
    label: string;
    href: string;
    icon: typeof Droplet;
    match: (path: string) => boolean;
};

const navItems: NavItem[] = [
    {
        label: 'Donors',
        href: donorsRoute().url,
        icon: Droplet,
        match: (path) => path.startsWith('/donors') || path === '/',
    },
    {
        label: 'Find',
        href: `${donorsRoute().url}?tab=search`,
        icon: Search,
        match: (path) => path.startsWith('/donors') && path.includes('tab=search'),
    },
    {
        label: 'Donations',
        href: myDonationsRoute().url,
        icon: Clock,
        match: (path) => path.startsWith('/profile/donations'),
    },
    {
        label: 'Profile',
        href: profileRoute().url,
        icon: UserRound,
        match: (path) =>
            path.startsWith('/profile') && !path.startsWith('/profile/donations'),
    },
];

export default function DonorAppLayout({ children }: { children: React.ReactNode }) {
    const { component, url } = usePage();

    // Splash and auth pages render inside the shell without the bottom nav
    const isGuestPage = component === 'welcome' || component.startsWith('auth/');

    return (
        <div className="donor-shell flex flex-col">
            <main className="flex-1 animate-view-enter">{children}</main>

            {!isGuestPage && (
                <nav className="bottom-nav sticky bottom-0 z-30 border-t border-line bg-white pb-[env(safe-area-inset-bottom,0px)]">
                    <div className="mx-auto grid max-w-[430px] grid-cols-4">
                        {navItems.map((item) => {
                            const active = item.match(url);
                            const Icon = item.icon;

                            return (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    aria-label={item.label}
                                    aria-current={active ? 'page' : undefined}
                                    className={cn(
                                        'flex flex-col items-center gap-0.5 py-2.5 transition active:bg-line-soft',
                                        active ? 'text-blood' : 'text-ink-mute',
                                    )}
                                >
                                    <Icon className="h-5 w-5" aria-hidden="true" />
                                    <span className="text-[10.5px] font-medium">
                                        {item.label}
                                    </span>
                                </a>
                            );
                        })}
                    </div>
                </nav>
            )}
        </div>
    );
}
