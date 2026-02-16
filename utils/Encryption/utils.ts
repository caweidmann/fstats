export const SHA256 = {
  encrypt: async (input: string): Promise<string> => {
    const encoded = new TextEncoder().encode(input)
    const buffer = await window.crypto.subtle.digest('SHA-256', encoded)

    return Array.from(new Uint8Array(buffer))
      .map((val) => val.toString(16).padStart(2, '0'))
      .join('')
  },
}
