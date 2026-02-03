/** @type {import('next-sitemap').IConfig} */

const allowRobots = {
  userAgent: '*',
  allow: '/',
}
const blockRobots = {
  userAgent: '*',
  disallow: '/',
}

module.exports = {
  generateIndexSitemap: false,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [process.env.NEXT_PUBLIC_SITE_URL === 'https://caweidmann.dev' ? allowRobots : blockRobots],
  },
}
