'use client'

import { ErrorView } from '@/components/errors/error-view'


export default function Error({ reset }: { reset: () => void }) {
    return <ErrorView reset={reset} />
}