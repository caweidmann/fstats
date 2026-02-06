import lodash from 'lodash'

// Lodash proxies / TODO: Write own versions
// NOTE: Do not change to `export { default as get } from 'lodash/get'` syntax as that breaks imports on server side
export const { get } = lodash
