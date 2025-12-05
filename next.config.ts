import type { NextConfig } from "next";
// const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

const nextConfig: NextConfig = {
  webpack: (config) => {
    // config.plugins.push(
    //   new MonacoWebpackPlugin({
    //     languages: ["json", "markdown", "css", "typescript", "javascript", "html", "xml", "go", "python", "java", "cpp"],
    //     filename: "static/[name].worker.js",
    //   })
    // );
    return config;
  },
};

export default nextConfig;
