/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_ACTIONS === 'true'
const nextConfig = {
    output: 'export',
    basePath: isGithubPages? '/chartJs' : '',
    assetPrefix: isGithubPages ? '/chartJs/': ''
}
module.exports = nextConfig
