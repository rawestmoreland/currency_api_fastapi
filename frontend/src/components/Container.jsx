import PropTypes from 'prop-types'
import clsx from 'clsx'

Container.propTypes = {
  className: PropTypes.string,
}

export function Container({ className, ...props }) {
  return <div className={clsx('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className)} {...props} />
}
