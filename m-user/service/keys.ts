export const userKey = {
  all: ['user'] as const,
  detail: (id?: string | null) => [...userKey.all, id] as const,
}
