import posthtmlExtend from 'posthtml-extend'
import posthtmlInclude from 'posthtml-include'
import posthtml from 'posthtml'
import { dirname } from 'path'
import { getPackageInfo, merge, pluginError, normalizePath } from 'vituum/utils/common.js'

const { name } = getPackageInfo(import.meta.url)

/**
 * @type {import('@vituum/vite-plugin-posthtml/types').PluginUserConfig} pluginOptions
 */
const defaultOptions = {
    root: null,
    extend: {},
    include: {},
    plugins: [],
    options: {}
}

/**
 * @param {import('@vituum/vite-plugin-posthtml/types').PluginUserConfig} pluginOptions
 * @returns {import('vite').Plugin}
 */
const plugin = (pluginOptions = {}) => {
    pluginOptions = merge(defaultOptions, pluginOptions)

    if (pluginOptions.root) {
        pluginOptions.root = normalizePath(pluginOptions.root)
    }

    return {
        name,
        enforce: 'pre',
        transformIndexHtml: {
            order: 'pre',
            handler: async (html, { filename, server }) => {
                if (filename.replace('.html', '').endsWith('.json') && html.startsWith('{')) {
                    return html
                }

                const plugins = []

                if (pluginOptions.extend) {
                    plugins.push(posthtmlExtend({ root: pluginOptions.root ? pluginOptions.root : dirname(filename), ...pluginOptions.extend }))
                }

                if (pluginOptions.include) {
                    plugins.push(posthtmlInclude({ root: pluginOptions.root ? pluginOptions.root : dirname(filename), ...pluginOptions.include }))
                }

                const render = await new Promise((resolve) => {
                    const output = {}

                    posthtml(plugins.concat(...pluginOptions.plugins)).process(html, pluginOptions.options).catch(error => {
                        output.error = error
                        resolve(output)
                    }).then(result => {
                        // @ts-ignore
                        output.content = result?.html
                        resolve(output)
                    })
                })

                const renderError = pluginError(render.error, server, name)

                if (renderError && server) {
                    return
                } else if (renderError) {
                    return renderError
                }

                return render.content
            }
        }
    }
}

export default plugin
