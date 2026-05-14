module.exports = {
  extends: ["react-app"],
  plugins: ["unused-imports"],
  rules: {
    "no-unused-vars": "off", // tắt rule cũ
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      {
        vars: "all",
        varsIgnorePattern: "^_",
        args: "after-used",
        argsIgnorePattern: "^_",
      },
    ],
  },
};