/** @type {import('next').NextConfig} */
const nextConfig = {}
const isGithubPages = process.env.GITHUB_ACTIONS === 'true'
module.exports = {
    output: 'export',
    basePath: isGithubPages? '/chartJs/chartJs' : '',
    assetPrefix: isGithubPages ? '/chartJs/chartJs': ''
}
