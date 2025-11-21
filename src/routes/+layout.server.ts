import type { LayoutServerLoad } from './$types'

export const load: LayoutServerLoad = (event) => {
  return {
    hasVoted: event.locals.hasVoted ?? false
  }
}
