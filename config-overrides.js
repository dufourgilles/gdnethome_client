const { override, fixBabelImports, addLessLoader } = require("customize-cra");
module.exports = override(
  fixBabelImports("import", {
    libraryName: "antd",
    libraryDirectory: "es",
    style: true
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      "@primary-color": "rgba(147, 112, 219, 1)",
      "@success-color": "rgba(93, 253, 203, 1)",
      "@link-color": "rgba(147, 112, 219, 1)",
      "@text-color": "rgba(92, 65, 151, 1)",
      "@body-background": "rgba(244, 250, 255, 1)",
      "@component-background": "rgba(244, 250, 255, 1)",
      "@font-family": "Roboto",
      "@layout-body-background": "@body-background",
      "@layout-header-background": "rgba(147, 112, 219, 1)",
      "@layout-header-color": "@text-color",
      "@layout-sider-background-light": "@body-background",
      "@layout-trigger-background": "@primary-color",
      "@layout-trigger-background-light": "@body-background",
      "@layout-trigger-color": "@body-background",
      "@layout-trigger-color-light": "@text-color"
    }
  })
);
