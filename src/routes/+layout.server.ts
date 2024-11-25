import type { LayoutServerLoad } from './$types'
import { getServerSession } from '@supabase/auth-helpers-sveltekit'

export const load: LayoutServerLoad = async (event) => {  
  return {
    hasVoted : event.locals.hasVoted ?? false,
    session: await getServerSession(event),
  }
}
