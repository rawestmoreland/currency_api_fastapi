import PropTypes from 'prop-types'

import backgroundImage from '@/images/background-auth.jpg'

SlimLayout.propTypes = {
  children: PropTypes.node,
}

export function SlimLayout({ children }) {
  return (
    <div className="relative flex min-h-full justify-center md:px-12 lg:px-0">
      <div className="relative z-10 flex flex-1 flex-col bg-white px-4 py-10 shadow-2xl sm:justify-center md:flex-none md:px-28">
        <main className="mx-auto flex w-full max-w-md flex-col gap-4 sm:px-4 md:w-96 md:max-w-sm md:px-0">
          {children}
        </main>
      </div>
      <div className="hidden sm:contents lg:relative lg:block lg:flex-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" className="absolute inset-0 h-full w-full object-cover" src={backgroundImage.src} />
      </div>
    </div>
  )
}
