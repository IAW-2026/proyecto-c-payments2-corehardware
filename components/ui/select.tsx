'use client'
 
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
 
interface SelectProps {
    value: string
    onChange: (value: string) => void
    options: string[]
}
 
export function Select({ value, onChange, options }: SelectProps) {
    return (
        <Listbox value={value} onChange={onChange}>
            <ListboxButton className="w-full px-3 py-2 bg-white dark:bg-neutral-950 border border-neutral-300 dark:border-neutral-800 rounded-lg text-sm text-neutral-700 dark:text-neutral-300 text-left focus:outline-none">
                {value}
            </ListboxButton>
            <ListboxOptions anchor="bottom start" className="w-[var(--button-width)] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden">
                {options.map((option) => (
                    <ListboxOption
                        key={option}
                        value={option}
                        className="px-3 py-2 text-sm cursor-pointer text-neutral-700 dark:text-neutral-300 data-[focus]:bg-green-500/10 data-[focus]:text-green-600 dark:data-[focus]:text-green-500"
                    >
                        {option}
                    </ListboxOption>
                ))}
            </ListboxOptions>
        </Listbox>
    )
}