export const statsFileKey = {
  all: ['stats-files'] as const,
  detail: (id?: string | null) => [...statsFileKey.all, id] as const,
}
