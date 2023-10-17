/* eslint-disable react/no-children-prop */

'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Tab } from '@headlessui/react'
import clsx from 'clsx'

import { Container } from '@/components/Container'
import backgroundImage from '@/images/background-features.jpg'
import screenshotExpenses from '@/images/screenshots/expenses.png'
import screenshotPayroll from '@/images/screenshots/payroll.png'
import screenshotReporting from '@/images/screenshots/reporting.png'
import screenshotVatReturns from '@/images/screenshots/vat-returns.png'
import Markdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { nord } from 'react-syntax-highlighter/dist/esm/styles/prism'

const features = [
  {
    title: 'Ease of Use',
    description:
      'Plug and play functionality with straightforward integration. Get started in minutes, not hours.',
    image: screenshotPayroll,
  },
  {
    title: 'Frequent Updates',
    description:
      'Frequent updates every few minutes ensure you always have the latest exchange rates at your fingertips.',
    image: screenshotExpenses,
  },
  {
    title: 'Cost-Efficient',
    description:
      "Premium currency data doesn't have to be expensive. Enjoy competitive pricing without breaking the bank.",
    image: screenshotVatReturns,
  },
  {
    title: 'Global Currencies',
    description:
      'Access a comprehensive list of worldwide currencies, ensuring global coverage for your applications.',
    image: screenshotReporting,
  },
]

const markdown = `
~~~json
{
  "base": "USD",
  "rates": {
      "AED": 3.673,
      "AFN": 75.718177,
      "ALL": 100.584954,
      "AMD": 398.155003,
      "ANG": 1.803015,
      "AOA": 825.5261,
      "ARS": 350.244312,
      "AUD": 1.590515,
      "AWG": 1.8,
      "AZN": 1.7,
      "BAM": 1.860275,
      "BBD": 2.0,
      "BDT": 110.296307,
      "BGN": 1.860275,
      "BHD": 0.377134,
      "BIF": 2837.247246,
      /* ... */
  }
~~~
`

export function PrimaryFeatures() {
  const [tabOrientation, setTabOrientation] = useState('horizontal')

  useEffect(() => {
    const lgMediaQuery = window.matchMedia('(min-width: 1024px)')

    function onMediaQueryChange({ matches }) {
      setTabOrientation(matches ? 'vertical' : 'horizontal')
    }

    onMediaQueryChange(lgMediaQuery)
    lgMediaQuery.addEventListener('change', onMediaQueryChange)

    return () => {
      lgMediaQuery.removeEventListener('change', onMediaQueryChange)
    }
  }, [])

  return (
    <section
      aria-label="Features for running your books"
      className="relative overflow-hidden bg-blue-600 pb-28 pt-20 sm:py-32"
      id="features"
    >
      <Image
        alt=""
        className="absolute left-1/2 top-1/2 max-w-none translate-x-[-44%] translate-y-[-42%]"
        height={1636}
        src={backgroundImage}
        unoptimized
        width={2245}
      />
      <Container className="relative">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl md:text-5xl">
            Everything you need to power your currency conversions.
          </h2>
          <p className="mt-6 text-lg tracking-tight text-blue-100">
            Well, everything you need if you aren&apos;t too fussy about minute
            fluctuations every second.
          </p>
        </div>
        <Tab.Group
          as="div"
          className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0"
          vertical={tabOrientation === 'vertical'}
        >
          {({ selectedIndex }) => (
            <>
              <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
                <Tab.List className="relative z-10 flex gap-x-4 whitespace-nowrap px-4 sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal">
                  {features.map((feature, featureIndex) => (
                    <div
                      key={feature.title}
                      className={clsx(
                        'group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6',
                        selectedIndex === featureIndex
                          ? 'bg-white lg:bg-white/10 lg:ring-1 lg:ring-inset lg:ring-white/10'
                          : 'hover:bg-white/10 lg:hover:bg-white/5',
                      )}
                    >
                      <h3>
                        <Tab
                          className={clsx(
                            'font-display ui-not-focus-visible:outline-none text-lg',
                            selectedIndex === featureIndex
                              ? 'text-blue-600 lg:text-white'
                              : 'text-blue-100 hover:text-white lg:text-white',
                          )}
                        >
                          <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none" />
                          {feature.title}
                        </Tab>
                      </h3>
                      <p
                        className={clsx(
                          'mt-2 hidden text-sm lg:block',
                          selectedIndex === featureIndex
                            ? 'text-white'
                            : 'text-blue-100 group-hover:text-white',
                        )}
                      >
                        {feature.description}
                      </p>
                    </div>
                  ))}
                </Tab.List>
              </div>
              <Tab.Panels className="lg:col-span-7">
                {features.map(feature => (
                  <Tab.Panel key={feature.title} unmount={false}>
                    <div className="relative sm:px-6 lg:hidden">
                      <div className="absolute -inset-x-4 bottom-[-4.25rem] top-[-6.5rem] bg-white/10 ring-1 ring-inset ring-white/10 sm:inset-x-0 sm:rounded-t-xl" />
                      <p className="relative mx-auto max-w-2xl text-base text-white sm:text-center">
                        {feature.description}
                      </p>
                    </div>
                    <div className="mt-16 w-[45rem] overflow-hidden rounded-xl font-bold text-white shadow-lg shadow-blue-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem] lg:text-xl">
                      <Markdown
                        children={markdown}
                        components={{
                          // eslint-disable-next-line react/no-unstable-nested-components
                          code(props) {
                            // eslint-disable-next-line react/prop-types
                            const { children, className, node, ...rest } = props
                            const match = /language-(\w+)/.exec(className || '')
                            return match ? (
                              <SyntaxHighlighter
                                {...rest}
                                children={String(children).replace(/\n$/, '')}
                                style={nord}
                                language={match[1]}
                                PreTag="div"
                              />
                            ) : (
                              <code {...rest} className={className}>
                                {children}
                              </code>
                            )
                          },
                        }}
                      />
                    </div>
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </>
          )}
        </Tab.Group>
      </Container>
    </section>
  )
}
