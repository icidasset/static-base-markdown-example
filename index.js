import { run } from 'static-base';
import { frontmatter, read, renameExt, write } from 'static-base-contrib';
import { markdown } from 'markdown';
import Mustache from 'mustache';


/**
 * Params
 *
 * 1. the glob pattern to select our markdown files
 * 2. the path to the directory in which our posts live
 */
const fileSelector = 'input/posts/*.md';
const rootDirectoryPath = __dirname;


/**
 * Aliases
 *
 * To better explain our example.
 */
const extract = frontmatter;
const change = renameExt;


/**
 * Markdown parser
 */
function convert(files) {
  // return new files array
  return files.map(function(file) {
    // make a copy of the file object,
    // and put the parsed markdown in it
    return {
      ...file,
      content: markdown.toHTML(file.content),
    };
  });
}


/**
 * Wrap function
 *
 * Uses Mustache as the template syntax.
 */
const layout = `
<!DOCTYPE html>
<html>
  <head><title>{{title}}</title></head>
  <body><h1>{{title}}</h1>{{{content}}}</body>
</html>
`.trim();

function wrap(files) {
  // return new files array
  return files.map(function(file) {
    // make a copy of the file object,
    // and put the rendered layout template in it
    return {
      ...file,
      content: Mustache.render(layout, file),
    };
  });
}


/**
 * Run the sequence (ie. build)
 */
run(
  read,
  extract,
  convert,
  wrap,
  [change, '.html'],  // change the extension of the file
  [write, 'output']   // write the file to the 'output' directory
)(
  fileSelector,
  rootDirectoryPath
).then(function() {
  console.log('BUILD SUCCEEDED :D');
}, function(error) {
  console.error('BUILD FAILED :(');
  console.error(error);
});
