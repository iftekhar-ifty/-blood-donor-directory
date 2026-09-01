import { Head, Link, router, usePage } from '@inertiajs/react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import BottomSheet from '@/components/donor/bottom-sheet';
import DonorAvatar from '@/components/donor/donor-avatar';
import DonorCard from '@/components/donor/donor-card';
import { selectClass } from '@/components/donor/form-styles';
import {
    BLOOD_GROUPS,
    type PublicDonor,
    type UnionOption,
    type VillageOption,
} from '@/components/donor/types';
import { index as donorsIndexRoute } from '@/routes/donors';
import { cn } from '@/lib/utils';

type Filters = {
    search: string;
    blood_group: string;
    availability: string;
    union_id: string;
    village_id: string;
    donation_status: string;
};

type Props = {
    donors: {
        data: PublicDonor[];
        current_page: number;
        last_page: number;
    };
    filters: Partial<Filters>;
    stats: { total: number; available: number };
    unions: UnionOption[];
    villages: VillageOption[];
};

const DEFAULT_FILTERS: Filters = {
    search: '',
    blood_group: 'all',
    availability: 'all',
    union_id: 'all',
    village_id: 'all',
    donation_status: 'all',
};

const DONATION_STATUS_LABELS: Record<string, string> = {
    never: 'Never Donated',
    recent: 'Recently Donated (90 days)',
    before: 'Donated Before',
};

function toQuery(filters: Filters, page?: number): Record<string, string | number> {
    return {
        ...(filters.search ? { search: filters.search } : {}),
        ...(filters.blood_group !== 'all' ? { blood_group: filters.blood_group } : {}),
        ...(filters.availability !== 'all' ? { availability: filters.availability } : {}),
        ...(filters.union_id !== 'all' ? { union_id: filters.union_id } : {}),
        ...(filters.village_id !== 'all' ? { village_id: filters.village_id } : {}),
        ...(filters.donation_status !== 'all'
            ? { donation_status: filters.donation_status }
            : {}),
        ...(page && page > 1 ? { page } : {}),
    };
}

function applyFilters(filters: Filters) {
    router.get(donorsIndexRoute().url, toQuery(filters), {
        preserveState: true,
        preserveScroll: true,
    });
}

export default function DonorsIndex({ donors, filters, stats, unions, villages }: Props) {
    const auth = usePage().props.auth as { user?: { name: string } } | undefined;
    const [search, setSearch] = useState(filters.search ?? '');
    const [searchTimer, setSearchTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
    const [sheetFilters, setSheetFilters] = useState<Filters>({
        ...DEFAULT_FILTERS,
        ...filters,
    });
    const [filterOpen, setFilterOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Skeleton rows while a search/filter/pagination visit is in flight
    useEffect(() => {
        const removeStart = router.on('start', () => setLoading(true));
        const removeFinish = router.on('finish', () => setLoading(false));

        return () => {
            removeStart();
            removeFinish();
        };
    }, []);

    const current: Filters = { ...DEFAULT_FILTERS, ...filters };
    const tab = filters.search || current.blood_group !== 'all' ? 'search' : 'home';

    const activeFilterCount = [
        current.blood_group !== 'all',
        current.availability !== 'all',
        current.union_id !== 'all',
        current.village_id !== 'all',
        current.donation_status !== 'all',
    ].filter(Boolean).length;

    // Debounced search
    useEffect(() => {
        if (search === (filters.search ?? '')) {
            return;
        }

        if (searchTimer) {
            clearTimeout(searchTimer);
        }

        setSearchTimer(
            setTimeout(() => {
                applyFilters({ ...current, search });
            }, 400),
        );

        return () => {
            if (searchTimer) {
                clearTimeout(searchTimer);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const setChip = (bloodGroup: string) => {
        applyFilters({ ...current, blood_group: bloodGroup });
    };

    const clearAll = () => {
        setSearch('');
        setSheetFilters(DEFAULT_FILTERS);
        applyFilters(DEFAULT_FILTERS);
    };

    const sheetVillages = villages.filter(
        (village) => String(village.union_id) === String(sheetFilters.union_id),
    );

    return (
        <>
            <Head title="Blood Donors" />

            <div className="min-h-screen bg-page">
                {/* Header + search bar */}
                <div className="sticky top-0 z-20 border-b border-line bg-page">
                    <div className="flex items-center justify-between border-b border-line-soft bg-white px-4 py-3">
                        <div className="flex items-center gap-2">
                            <span className="h-5 w-5 fill-blood text-blood">●</span>
                            <h1 className="text-[16px] font-semibold">
                                {tab === 'search' ? 'Find Donors' : 'Blood Donors'}
                            </h1>
                        </div>
                        <Link href="/profile" aria-label="View your profile">
                            <DonorAvatar
                                name={auth?.user?.name ?? ''}
                                className="h-9 w-9 text-[12px]"
                            />
                        </Link>
                    </div>

                    <div className="flex gap-2 bg-page px-4 py-2.5">
                        <div className="relative flex-1">
                            <Search
                                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-mute"
                                aria-hidden="true"
                            />
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                type="search"
                                placeholder="Search name, village, blood group..."
                                aria-label="Search donors"
                                className="w-full rounded-lg border border-line bg-white py-2.5 pl-9 pr-3 text-[14px] outline-none focus:border-blood"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => {
                                setSheetFilters(current);
                                setFilterOpen(true);
                            }}
                            aria-label="Open filters"
                            className="relative flex items-center gap-1.5 rounded-lg border border-line bg-white px-3 text-[13px] font-medium hover:bg-line-soft"
                        >
                            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                            <span>Filter</span>
                            {activeFilterCount > 0 && (
                                <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-blood px-1 text-[10px] font-bold text-white">
                                    {activeFilterCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Blood group chips */}
                    <div className="no-scroll flex gap-1.5 overflow-x-auto bg-page px-4 pb-2.5">
                        <button
                            type="button"
                            onClick={() => setChip('all')}
                            className={cn(
                                'whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-semibold',
                                current.blood_group === 'all'
                                    ? 'bg-blood text-white'
                                    : 'border border-line bg-white text-ink',
                            )}
                        >
                            All
                        </button>
                        {BLOOD_GROUPS.map((group) => (
                            <button
                                key={group}
                                type="button"
                                onClick={() => setChip(group)}
                                className={cn(
                                    'whitespace-nowrap rounded-full px-3 py-1.5 font-mono text-[12px] font-bold',
                                    current.blood_group === group
                                        ? 'bg-blood text-white'
                                        : 'border border-line bg-white text-ink',
                                )}
                            >
                                {group}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="px-4 py-3">
                    <div className="mb-3">
                        <h2 className="text-[18px] font-bold tracking-tight">
                            Find Blood Donors
                        </h2>
                        <p className="mt-0.5 text-[12.5px] text-ink-soft">
                            {stats.total} Donors · {stats.available} Available · 8 Blood
                            Groups
                        </p>
                    </div>

                    {/* Active filter chips */}
                    {activeFilterCount > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1.5">
                            {current.blood_group !== 'all' && (
                                <FilterChip
                                    label={current.blood_group}
                                    mono
                                    onRemove={() => applyFilters({ ...current, blood_group: 'all' })}
                                />
                            )}
                            {current.availability !== 'all' && (
                                <FilterChip
                                    label={
                                        current.availability === 'available'
                                            ? 'Available'
                                            : 'Unavailable'
                                    }
                                    onRemove={() => applyFilters({ ...current, availability: 'all' })}
                                />
                            )}
                            {current.union_id !== 'all' && (
                                <FilterChip
                                    label={
                                        unions.find((u) => String(u.id) === current.union_id)
                                            ?.name ?? 'Union'
                                    }
                                    onRemove={() => applyFilters({ ...current, union_id: 'all' })}
                                />
                            )}
                            {current.village_id !== 'all' && (
                                <FilterChip
                                    label={
                                        villages.find((v) => String(v.id) === current.village_id)
                                            ?.name ?? 'Village'
                                    }
                                    onRemove={() => applyFilters({ ...current, village_id: 'all' })}
                                />
                            )}
                            {current.donation_status !== 'all' && (
                                <FilterChip
                                    label={DONATION_STATUS_LABELS[current.donation_status] ?? ''}
                                    onRemove={() => applyFilters({ ...current, donation_status: 'all' })}
                                />
                            )}
                        </div>
                    )}

                    {/* Donor list */}
                    <div className="space-y-2.5">
                        {loading &&
                            Array.from({ length: 4 }).map((_, index) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <div
                                    key={`skeleton-${index}`}
                                    className="flex items-center gap-3 rounded-lg border border-line bg-white p-3.5"
                                >
                                    <div className="h-11 w-11 animate-pulse rounded-full bg-line-soft" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-3.5 w-1/2 animate-pulse rounded bg-line-soft" />
                                        <div className="h-3 w-1/3 animate-pulse rounded bg-line-soft" />
                                    </div>
                                    <div className="h-7 w-12 animate-pulse rounded-full bg-line-soft" />
                                </div>
                            ))}

                        {!loading && donors.data.length === 0 && (
                            <div className="py-12 text-center">
                                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blood-tint">
                                    <Search className="h-8 w-8 text-blood" aria-hidden="true" />
                                </div>
                                <h3 className="mb-1.5 text-[16px] font-semibold text-ink">
                                    No donors found
                                </h3>
                                <p className="mx-auto mb-5 max-w-[240px] text-[13px] leading-relaxed text-ink-soft">
                                    Try changing your blood group, location, or
                                    availability filter.
                                </p>
                                <button
                                    type="button"
                                    onClick={clearAll}
                                    className="rounded-md border border-blood px-4 py-2 text-[13px] font-semibold text-blood transition hover:bg-blood-tint"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}

                        {!loading &&
                            donors.data.map((donor) => (
                                <DonorCard key={donor.id} donor={donor} />
                            ))}
                    </div>

                    {/* Pagination */}
                    {donors.last_page > 1 && (
                        <div className="mt-4 flex items-center justify-center gap-3 text-[13px]">
                            {donors.current_page > 1 && (
                                <Link
                                    href={donorsIndexRoute({
                                        query: toQuery(current, donors.current_page - 1),
                                    }).url}
                                    className="rounded-md border border-line bg-white px-3 py-1.5 font-medium text-ink hover:bg-line-soft"
                                >
                                    ← Prev
                                </Link>
                            )}
                            <span className="text-ink-soft">
                                Page {donors.current_page} of {donors.last_page}
                            </span>
                            {donors.current_page < donors.last_page && (
                                <Link
                                    href={donorsIndexRoute({
                                        query: toQuery(current, donors.current_page + 1),
                                    }).url}
                                    className="rounded-md border border-line bg-white px-3 py-1.5 font-medium text-ink hover:bg-line-soft"
                                >
                                    Next →
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Filter bottom sheet */}
            <BottomSheet
                open={filterOpen}
                onClose={() => setFilterOpen(false)}
                title="Filters"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setSheetFilters(DEFAULT_FILTERS)}
                            className="flex-1 rounded-md border border-line py-3 text-[14px] font-medium text-ink hover:bg-line-soft"
                        >
                            Clear All
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setFilterOpen(false);
                                applyFilters(sheetFilters);
                            }}
                            className="flex-1 rounded-md bg-blood py-3 text-[14px] font-semibold text-white hover:bg-blood-deep"
                        >
                            Apply Filters
                        </button>
                    </>
                }
            >
                <div className="space-y-5">
                    <div>
                        <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">
                            Blood Group
                        </h3>
                        <div className="grid grid-cols-4 gap-2">
                            {[('all' as const), ...BLOOD_GROUPS].map((group) => (
                                <button
                                    key={group}
                                    type="button"
                                    onClick={() =>
                                        setSheetFilters((f) => ({ ...f, blood_group: group }))
                                    }
                                    className={cn(
                                        'rounded-md border py-2 font-mono text-[12.5px] font-bold',
                                        group === 'all' && 'font-sans font-semibold',
                                        sheetFilters.blood_group === group
                                            ? 'border-blood bg-blood text-white'
                                            : 'border-line bg-white text-ink',
                                    )}
                                >
                                    {group === 'all' ? 'All' : group}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">
                            Availability
                        </h3>
                        <div className="space-y-1.5">
                            {(
                                [
                                    ['all', 'All Donors', 'bg-ink-mute'],
                                    ['available', 'Available Now', 'bg-good'],
                                    ['unavailable', 'Not Available', 'bg-ink-mute'],
                                ] as const
                            ).map(([value, label, dot]) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() =>
                                        setSheetFilters((f) => ({ ...f, availability: value }))
                                    }
                                    className={cn(
                                        'flex w-full items-center justify-between rounded-md border px-3 py-2.5 text-left',
                                        sheetFilters.availability === value
                                            ? 'border-blood bg-blood-tint'
                                            : 'border-line bg-white',
                                    )}
                                >
                                    <span className="flex items-center gap-2 text-[13.5px] font-medium text-ink">
                                        <span className={cn('h-2 w-2 rounded-full', dot)} />
                                        {label}
                                    </span>
                                    <span
                                        className={cn(
                                            'h-4 w-4 rounded-full border',
                                            sheetFilters.availability === value
                                                ? 'border-blood bg-blood'
                                                : 'border-line',
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">
                            Location
                        </h3>
                        <div className="space-y-3">
                            <select
                                aria-label="Union filter"
                                value={sheetFilters.union_id}
                                onChange={(event) =>
                                    setSheetFilters((f) => ({
                                        ...f,
                                        union_id: event.target.value,
                                        village_id: 'all',
                                    }))
                                }
                                className={selectClass}
                            >
                                <option value="all">All Unions</option>
                                {unions.map((union) => (
                                    <option key={union.id} value={union.id}>
                                        {union.name}
                                    </option>
                                ))}
                            </select>
                            <select
                                aria-label="Village filter"
                                value={sheetFilters.village_id}
                                disabled={sheetFilters.union_id === 'all'}
                                onChange={(event) =>
                                    setSheetFilters((f) => ({ ...f, village_id: event.target.value }))
                                }
                                className={selectClass}
                            >
                                <option value="all">
                                    {sheetFilters.union_id === 'all'
                                        ? 'All Villages'
                                        : 'All villages in union'}
                                </option>
                                {sheetVillages.map((village) => (
                                    <option key={village.id} value={village.id}>
                                        {village.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-mute">
                            Donation Status
                        </h3>
                        <div className="space-y-1.5">
                            {Object.entries(DONATION_STATUS_LABELS).map(([value, label]) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() =>
                                        setSheetFilters((f) => ({ ...f, donation_status: value }))
                                    }
                                    className={cn(
                                        'flex w-full items-center justify-between rounded-md border px-3 py-2.5 text-left',
                                        sheetFilters.donation_status === value
                                            ? 'border-blood bg-blood-tint'
                                            : 'border-line bg-white',
                                    )}
                                >
                                    <span className="text-[13.5px] font-medium text-ink">
                                        {label}
                                    </span>
                                    <span
                                        className={cn(
                                            'h-4 w-4 rounded-full border',
                                            sheetFilters.donation_status === value
                                                ? 'border-blood bg-blood'
                                                : 'border-line',
                                        )}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </BottomSheet>
        </>
    );
}

function FilterChip({
    label,
    mono = false,
    onRemove,
}: {
    label: string;
    mono?: boolean;
    onRemove: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onRemove}
            className="flex items-center gap-1 rounded-full bg-blood-tint px-2.5 py-1 text-[12px] font-medium text-blood"
        >
            <span className={cn(mono && 'font-mono font-bold')}>{label}</span>
            <X className="h-3 w-3" strokeWidth={2.5} aria-hidden="true" />
        </button>
    );
}
