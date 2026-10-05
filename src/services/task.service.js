const tasks = [
  {
    id: 1,
    userId: 1,
    title: "Complete Day 3",
  },
  {
    id: 2,
    userId: 1,
    title: "Create service layer",
  },
];

async function getTasks(userId) {
  return tasks.filter(
    (task) => task.userId === userId
  );
}

export {
  getTasks,
};
