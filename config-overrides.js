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
        "@link-color": "rgba(147, 112, 219, 1)", 
        "@text-color": "rgba(8, 9, 10, 1)",
        "@body-background": "rgba(244, 250, 255, 1)" 
    }
  })
);
