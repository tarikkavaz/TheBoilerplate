'use client'

import { useTranslations } from 'next-intl'
import { useEffect } from 'react'
import Container from '@/components/ui/Container'

type Props = {
  error: Error
  reset(): void
}

export default function Error({ error, reset }: Props) {
  const t = useTranslations('Globals')

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Container title={t('errortitle')}>
      <div>
        {t.rich('errortext', {
          p: (chunks) => <p className="mt-4">{chunks}</p>,
          retry: (chunks) => (
            <button
              className="text-black underline underline-offset-2"
              onClick={reset}
              type="button"
            >
              {chunks}
            </button>
          ),
        })}
      </div>
    </Container>
  )
}
