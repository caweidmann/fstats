import { z } from 'zod'

import { ParserId } from '@/types-enums'

export const zParserId = z.enum([ParserId.CAPITEC, ParserId.COMDIRECT_GIRO] as const)
