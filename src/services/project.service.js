const projects = [
  {
    id: 1,
    userId: 1,
    name: "Product Catalog",
  },
  {
    id: 2,
    userId: 1,
    name: "Task Manager",
  },
];

async function getProjects(userId) {
  return projects.filter(
    (project) => project.userId === userId
  );
}

export {
  getProjects,
};