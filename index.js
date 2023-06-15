import posthtmlExtend from 'posthtml-extend'
import posthtmlInclude from 'posthtml-include'
import posthtml from 'posthtml'
import { dirname } from 'path'
import { getPackageInfo, merge } from 'vituum/utils/common.js'

const { name } = getPackageInfo(import.meta.url)

/**
 * @type {import('@vituum/vite-plugin-posthtml/types/index.d.ts').PluginUserConfig} pluginOptions
 */
const defaultOptions = {
    root: null,
    extend: {},
    include: {},
    plugins: [],
    options: {}
}

/**
 * @param {import('@vituum/vite-plugin-posthtml/types/index.d.ts').PluginUserConfig} pluginOptions
 * @returns {import('vite').Plugin}
 */
const plugin = (pluginOptions = {}) => {
    pluginOptions = merge(defaultOptions, pluginOptions)

    return {
        name,
        enforce: 'pre',
        transformIndexHtml: {
            enforce: 'pre',
            transform: async (html, { filename }) => {
                const plugins = []

                if (pluginOptions.extend) {
                    plugins.push(posthtmlExtend({ root: pluginOptions.root ? pluginOptions.root : dirname(filename), ...pluginOptions.extend }))
                }

                if (pluginOptions.include) {
                    plugins.push(posthtmlInclude({ root: pluginOptions.root ? pluginOptions.root : dirname(filename), ...pluginOptions.include }))
                }

                const result = await posthtml(plugins.concat(...pluginOptions.plugins)).process(html, pluginOptions.options)

                return result.html
            }
        }
    }
}

export default plugin
