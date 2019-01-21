// Remove extension from filename
// e.g., foo.js -> foo
module.exports = filename => filename.replace(/\.[^/.]+$/, '');
