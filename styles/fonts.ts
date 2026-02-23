import { Roboto, Roboto_Mono, Trispace } from 'next/font/google'

export const roboto = Roboto({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
})

export const robotoMono = Roboto_Mono({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto-mono',
})

export const trispace = Trispace({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-trispace',
})
