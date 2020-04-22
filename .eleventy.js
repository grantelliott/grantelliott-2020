const htmlmin = require("html-minifier");

// For images
const fg = require('fast-glob');
const imagePath = fg.sync("src/static/images/**/*.{jpg,jpeg}");

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/static");
  eleventyConfig.addPassthroughCopy("src/photos/**/*.{jpg,jpeg}");

  // Create collection of images
  eleventyConfig.addCollection('images', function(collection) {
    return imagePath;
  });

  if (process.env.ELEVENTY_ENV === 'production') {
    // Minify HTML (including inlined CSS)
    eleventyConfig.addTransform("compressHTML", function(content, outputPath) {
      if (outputPath.endsWith(".html")) {
        let minified = htmlmin.minify(content, {
          useShortDoctype: true,
          removeComments: true,
          collapseWhitespace: true,
          minifyCSS: true
        });
        return minified;
      }
      return content;
    });
  }

  return {
    dir: {
      input: "src/",
      output: "dist",
      includes: "_includes",
      layouts: "_layouts"
    },
    templateFormats: ["html", "md", "njk"],
    htmlTemplateEngine: "njk",

    passthroughFileCopy: true
  };
};
