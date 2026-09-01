import { selectClass } from '@/components/donor/form-styles';
import type { UnionOption, UpazilaOption, VillageOption } from '@/components/donor/types';
import VillageCombobox from '@/components/donor/village-combobox';
import { useEffect, useState } from 'react';

export default function LocationSelects({
    upazilas,
    unions,
    villages,
    unionId,
    villageId,
    onUnionChange,
    onVillageChange,
    onVillageCreated,
}: {
    upazilas: UpazilaOption[];
    unions: UnionOption[];
    villages: VillageOption[];
    unionId: string | number | null;
    villageId: string | number | null;
    onUnionChange: (unionId: string) => void;
    onVillageChange: (villageId: string) => void;
    onVillageCreated?: (village: VillageOption) => void;
}) {
    const selectedUnion = unions.find(
        (union) => String(union.id) === String(unionId ?? ''),
    );

    const [upazilaId, setUpazilaId] = useState(() =>
        selectedUnion?.upazila_id != null ? String(selectedUnion.upazila_id) : '',
    );

    // Follow external union changes (e.g. form reset) without wiping an
    // upazila the user just picked — that one clears the union on purpose.
    useEffect(() => {
        if (selectedUnion && selectedUnion.upazila_id != null) {
            setUpazilaId(String(selectedUnion.upazila_id));
        }
    }, [unionId]); // eslint-disable-line react-hooks/exhaustive-deps

    const upazilaUnions = upazilaId
        ? unions.filter((union) => String(union.upazila_id) === upazilaId)
        : [];

    return (
        <>
            <div>
                <label
                    htmlFor="upazila"
                    className="mb-1.5 block text-[12.5px] font-medium text-ink-soft"
                >
                    Upazila
                </label>
                <select
                    id="upazila"
                    value={upazilaId}
                    onChange={(event) => {
                        setUpazilaId(event.target.value);
                        // Changing the upazila invalidates the union and village choices
                        onUnionChange('');
                        onVillageChange('');
                    }}
                    className={selectClass}
                >
                    <option value="">Select upazila</option>
                    {upazilas.map((upazila) => (
                        <option key={upazila.id} value={upazila.id}>
                            {upazila.name}
                        </option>
                    ))}
                </select>
            </div>

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
                    disabled={!upazilaId}
                    className={selectClass}
                >
                    <option value="">
                        {upazilaId ? 'Select union' : 'Select an upazila first'}
                    </option>
                    {upazilaUnions.map((union) => (
                        <option key={union.id} value={union.id}>
                            {union.name}
                        </option>
                    ))}
                </select>
            </div>

            <VillageCombobox
                villages={villages}
                unionId={unionId}
                villageId={villageId}
                onVillageChange={onVillageChange}
                onVillageCreated={onVillageCreated}
            />
        </>
    );
}
