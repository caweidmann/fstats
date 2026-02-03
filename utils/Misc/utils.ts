import { differenceInYears } from 'date-fns'

import type { WorkExperienceItem } from '@/types'
import { EXPERIENCE } from '@/common'

const since = EXPERIENCE.ONE_OVER_ZERO.startDate
const contractorSince = EXPERIENCE.HOLMLAB.startDate

export const getYearsExperience = () => {
  const today = new Date()
  const yearsExperienceDate = new Date(since)
  const yearsIndependentDate = new Date(contractorSince)

  return {
    since,
    contractorSince,
    yearsExperience: differenceInYears(today, yearsExperienceDate),
    yearsExperienceDate,
    yearsIndependent: differenceInYears(today, yearsIndependentDate),
    yearsIndependentDate,
  }
}

export const sortExperienceItems = (a: WorkExperienceItem, b: WorkExperienceItem): number => {
  const aIsCurrent = a.endDate === null
  const bIsCurrent = b.endDate === null

  if (aIsCurrent && !bIsCurrent) {
    return -1
  }
  if (!aIsCurrent && bIsCurrent) {
    return 1
  }

  // Current positions: sort by start date descending (most recent first)
  if (aIsCurrent && bIsCurrent) {
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  }

  // Past positions: sort by end date descending (most recently ended first)
  return new Date(b.endDate!).getTime() - new Date(a.endDate!).getTime()
}
