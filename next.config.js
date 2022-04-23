/** @type {import('next').NextConfig} */
const withTM = require("next-transpile-modules")(["react-dnd"]); // or whatever library giving trouble

module.exports = withTM({
  reactStrictMode: true,
});
