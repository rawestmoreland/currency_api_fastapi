'use client'

import { useUser } from '@/providers/UserProvider'
import { Progress } from '@/components/ui/progress'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import DashboardSkeleton from './DashboardSkeleton'

export default function DashboardClient() {
  const { userData, isLoading } = useUser()

  if (isLoading || !userData) {
    return <DashboardSkeleton />
  }

  const {
    month,
    year,
    request_limit: limit,
    requests_made: requests,
  } = userData.usage
  const percentage = Math.floor((requests / limit) * 100)

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h1 className="mb-4 text-2xl font-bold">Welcome to your account!</h1>
        <div className="flex flex-col gap-4">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label htmlFor="usageProgress">
            Your usage data for{' '}
            <span className="font-bold">{`${month}/${year}`}</span>
          </label>
          <Progress className="" id="usageProgress" value={percentage} />
          <p>{`${requests} of ${limit} requests made`}</p>
        </div>
      </section>
      <section>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>What counts as one API request?</AccordionTrigger>
            <AccordionContent>
              <ul className="flex flex-col gap-4">
                <li>
                  Each HTTP request to our /latest endpoint counts as a single
                  request towards your usage quota (regardless of the number of
                  currencies or data points returned).
                </li>
                <li>
                  Requests to our /currencies and usage.json API endpoints are
                  &apos;free&apos;, and don&apos;t count towards your quota.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              What happens if I go over my allowance?
            </AccordionTrigger>
            <AccordionContent>
              <ul className="flex flex-col gap-4">
                <li>
                  If you exceed your API request allowance in a given period,
                  we&apos;ll get in touch via email to discuss ways we can keep
                  supporting you. You may choose to lower your usage or
                  subscribe to a plan with a higher monthly request volume. Your
                  app ID and any connected integrations will remain active (we
                  won&apos;t restrict access without attempting to make contact
                  several times first).
                </li>
                <li>
                  If we don&apos;t hear back from you after reaching out several
                  times (or if your usage volume stays over the quota for two
                  months or more) we may then restrict your access. You can
                  restore your access by contacting us.
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>
    </div>
  )
}
