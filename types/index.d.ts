export interface PluginUserConfig {
    root?: string
    extend?: Object
    include?: Object
    plugins?: import('posthtml').Plugin<any>[]
    options?: import('posthtml').Options
}
