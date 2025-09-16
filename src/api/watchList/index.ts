export default (app) => {
  app.put(`/watch-list/create`, require("./watchListCreate").default);
  app.get(`/watch-list/:id`, require("./watchListGetById").default);
};
