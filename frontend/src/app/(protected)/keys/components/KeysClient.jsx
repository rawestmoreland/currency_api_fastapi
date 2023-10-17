'use client'

import { useKeys } from '@/providers/UserKeysProvider'
import KeyTable from './KeyTable'

export default function KeysClient() {
  const { keysData } = useKeys()

  return (
    <div className="flex flex-col gap-4">
      <section>
        <h1 className="mb-4 text-2xl font-bold">Your API Keys</h1>
        <KeyTable keys={keysData || []} />
      </section>
    </div>
  )
}
