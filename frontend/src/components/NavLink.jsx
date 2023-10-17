import PropTypes from 'prop-types'
import Link from 'next/link'

NavLink.propTypes = {
  href: PropTypes.string,
  children: PropTypes.node,
}

export function NavLink({ href, children }) {
  return (
    <Link
      className="inline-block rounded-lg px-2 py-1 text-sm text-slate-700 hover:bg-slate-100 hover:text-slate-900"
      href={href}
    >
      {children}
    </Link>
  )
}
