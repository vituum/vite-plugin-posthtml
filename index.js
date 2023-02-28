import lodash from 'lodash'
import posthtmlExtend from 'posthtml-extend'
import posthtmlInclude from 'posthtml-include'
import posthtml from 'posthtml'

const plugin = (pluginOptions = {}) => {
    pluginOptions = lodash.merge({
        plugins: []
    }, pluginOptions)

    return {
        name: '@vituum/vite-plugin-posthtml',
        enforce: 'pre',
        config: ({ root }) => {
            if (!pluginOptions.root) {
                pluginOptions.root = root
            }
        },
        transformIndexHtml: {
            enforce: 'pre',
            transform: async(html, { filename }) => {
                const plugins = [
                    posthtmlExtend({ encoding: 'utf8', root: pluginOptions.root }),
                    posthtmlInclude({ encoding: 'utf8', root: pluginOptions.root })
                ]

                const result = await posthtml(plugins.concat(...pluginOptions.plugins)).process(html, pluginOptions.options || {})

                return result.html
            }
        }
    }
}

export default plugin
