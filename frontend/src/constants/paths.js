const baseUrl = `http://localhost:3000`

export const paths = {
  home: '/',
  login: '/login',
  register: '/register',
  dashboard: '/dashboard',
}

export const absolutePaths = Object.fromEntries(
  Object.entries(paths).map(([key, value]) => [key, baseUrl + value]),
)
