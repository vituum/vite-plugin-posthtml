export interface PluginUserConfig {
    enforce?: 'post' | 'pre'
    root?: string
    extend?: Object
    include?: Object
    plugins?: import('posthtml').Plugin<any>[]
    options?: import('posthtml').Options
}
