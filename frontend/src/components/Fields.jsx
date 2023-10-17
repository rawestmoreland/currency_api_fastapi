import { useId } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

const formClasses =
  'block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 sm:text-sm'

Label.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
}

function Label({ id, children }) {
  return (
    <label
      className="mb-3 block text-sm font-medium text-gray-700"
      htmlFor={id}
    >
      {children}
    </label>
  )
}

TextField.propTypes = {
  error: PropTypes.shape({ message: PropTypes.string }),
  label: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
}

export function TextField({
  error,
  label,
  type = 'text',
  className,
  ...props
}) {
  const id = useId()

  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <input
        aria-label={id}
        id={id}
        type={type}
        {...props}
        className={formClasses}
      />
      {!!error && (
        <div className="mt-2 rounded-sm p-1 text-sm font-semibold text-destructive">
          {error.message}
        </div>
      )}
    </div>
  )
}

SelectField.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
}

export function SelectField({ label, className, ...props }) {
  const id = useId()

  return (
    <div className={className}>
      {label && <Label id={id}>{label}</Label>}
      <select id={id} {...props} className={clsx(formClasses, 'pr-8')} />
    </div>
  )
}
