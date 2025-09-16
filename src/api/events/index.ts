export default (app) => {
  app.get(`/events`, require("./eventGetAll").default);
  app.get(`/events/:id`, require("./eventGetById").default);
};
