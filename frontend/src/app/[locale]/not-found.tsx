'use client'

import { useTranslations } from 'next-intl'
import PageLayout from '@/components/ui/PageLayout'

// Note that `app/[locale]/[...rest]/page.tsx`
// is necessary for this page to render.

export default function NotFoundPage() {
  const t = useTranslations('Globals')

  return (
    <PageLayout title={t('filenotfoundtitle')}>
      <p className="max-w-[460px]">{t('filenotfoundtext')}</p>
    </PageLayout>
  )
}
