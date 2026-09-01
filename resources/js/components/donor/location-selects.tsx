import { selectClass } from '@/components/donor/form-styles';
import type { UnionOption, VillageOption } from '@/components/donor/types';

export default function LocationSelects({
    unions,
    villages,
    unionId,
    villageId,
    onUnionChange,
    onVillageChange,
}: {
    unions: UnionOption[];
    villages: VillageOption[];
    unionId: string | number | null;
    villageId: string | number | null;
    onUnionChange: (unionId: string) => void;
    onVillageChange: (villageId: string) => void;
}) {
    const unionVillages = villages.filter(
        (village) => String(village.union_id) === String(unionId ?? ''),
    );

    return (
        <>
            <div>
                <label
                    htmlFor="union"
                    className="mb-1.5 block text-[12.5px] font-medium text-ink-soft"
                >
                    Union
                </label>
                <select
                    id="union"
                    name="union_id"
                    value={unionId ? String(unionId) : ''}
                    onChange={(event) => {
                        onUnionChange(event.target.value);
                        // Changing the union invalidates the village choice
                        onVillageChange('');
                    }}
                    className={selectClass}
                >
                    <option value="">Select union</option>
                    {unions.map((union) => (
                        <option key={union.id} value={union.id}>
                            {union.name}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label
                    htmlFor="village"
                    className="mb-1.5 block text-[12.5px] font-medium text-ink-soft"
                >
                    Village
                </label>
                <select
                    id="village"
                    name="village_id"
                    value={villageId ? String(villageId) : ''}
                    onChange={(event) => onVillageChange(event.target.value)}
                    disabled={!unionId}
                    className={selectClass}
                >
                    <option value="">
                        {unionId ? 'Select village' : 'Select a union first'}
                    </option>
                    {unionVillages.map((village) => (
                        <option key={village.id} value={village.id}>
                            {village.name}
                        </option>
                    ))}
                </select>
            </div>
        </>
    );
}
