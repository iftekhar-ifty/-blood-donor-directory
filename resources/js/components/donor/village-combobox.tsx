import { inputClass } from '@/components/donor/form-styles';
import type { VillageOption } from '@/components/donor/types';
import { store as storeVillageRoute } from '@/routes/villages';
import { MapPin, Plus, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

function readXsrfToken(): string {
    const match = document.cookie
        .split('; ')
        .find((row) => row.startsWith('XSRF-TOKEN='));

    return match ? decodeURIComponent(match.split('=')[1]) : '';
}

export default function VillageCombobox({
    villages,
    unionId,
    villageId,
    onVillageChange,
    onVillageCreated,
}: {
    villages: VillageOption[];
    unionId: string | number | null;
    villageId: string | number | null;
    onVillageChange: (villageId: string) => void;
    onVillageCreated?: (village: VillageOption) => void;
}) {
    const selected = villages.find(
        (village) => String(village.id) === String(villageId ?? ''),
    );

    const [query, setQuery] = useState(selected?.name ?? '');
    const [open, setOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Keep the visible text in sync when the selection changes elsewhere
        setQuery(selected?.name ?? '');
    }, [villageId, selected?.name]);

    useEffect(() => {
        const onClickOutside = (event: MouseEvent) => {
            if (!wrapperRef.current?.contains(event.target as Node)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', onClickOutside);

        return () => document.removeEventListener('mousedown', onClickOutside);
    }, []);

    const unionVillages = useMemo(
        () =>
            villages.filter(
                (village) => String(village.union_id) === String(unionId ?? ''),
            ),
        [villages, unionId],
    );

    const normalized = query.trim().toLowerCase();
    const matches = normalized
        ? unionVillages.filter((village) =>
              village.name.toLowerCase().includes(normalized),
          )
        : unionVillages;
    const exactMatch = unionVillages.some(
        (village) => village.name.toLowerCase() === normalized,
    );

    async function createVillage(name: string) {
        setCreating(true);
        setError(null);

        try {
            const response = await fetch(storeVillageRoute.url(), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': readXsrfToken(),
                },
                body: JSON.stringify({ name, union_id: unionId }),
            });

            if (!response.ok) {
                throw new Error('Could not create the village');
            }

            const village: VillageOption = await response.json();

            onVillageCreated?.(village);
            onVillageChange(String(village.id));
            setQuery(village.name);
            setOpen(false);
        } catch {
            setError('Could not create the village — try again');
        } finally {
            setCreating(false);
        }
    }

    return (
        <div ref={wrapperRef} className="relative">
            <label
                htmlFor="village"
                className="mb-1.5 block text-[12.5px] font-medium text-ink-soft"
            >
                Village
            </label>

            {/* The form still submits village_id like the old select did */}
            <input type="hidden" name="village_id" value={villageId ? String(villageId) : ''} />

            <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-soft" aria-hidden="true" />
                <input
                    id="village"
                    type="text"
                    autoComplete="off"
                    value={query}
                    disabled={!unionId}
                    placeholder={unionId ? 'Search or add your village' : 'Select a union first'}
                    onFocus={() => setOpen(true)}
                    onChange={(event) => {
                        setQuery(event.target.value);
                        setOpen(true);
                    }}
                    className={`${inputClass} pl-9`}
                />
            </div>

            {error && <p className="mt-1 text-[12px] text-red-600">{error}</p>}

            {open && unionId && (
                <ul className="absolute z-20 mt-1 max-h-56 w-full overflow-y-auto rounded-xl border border-line bg-white py-1 shadow-lg">
                    {matches.map((village) => (
                        <li key={village.id}>
                            <button
                                type="button"
                                onClick={() => {
                                    onVillageChange(String(village.id));
                                    setQuery(village.name);
                                    setOpen(false);
                                }}
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13.5px] hover:bg-line-soft"
                            >
                                <MapPin className="h-3.5 w-3.5 shrink-0 text-ink-soft" aria-hidden="true" />
                                {village.name}
                            </button>
                        </li>
                    ))}

                    {normalized !== '' && !exactMatch && (
                        <li className="border-t border-line">
                            <button
                                type="button"
                                disabled={creating}
                                onClick={() => createVillage(query.trim())}
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[13.5px] font-medium text-red-700 hover:bg-red-50 disabled:opacity-60"
                            >
                                <Plus className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                                {creating ? 'Adding…' : `Create "${query.trim()}"`}
                            </button>
                        </li>
                    )}

                    {normalized === '' && unionVillages.length === 0 && (
                        <li className="px-3 py-2 text-[13px] text-ink-soft">
                            No villages yet — type to add yours
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
}
