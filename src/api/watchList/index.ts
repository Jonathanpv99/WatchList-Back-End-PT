export default (app) => {
  app.put(`/watch-list/create`, require("./watchListCreate").default);
};
