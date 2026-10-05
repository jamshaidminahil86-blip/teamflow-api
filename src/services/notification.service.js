const notifications = [
  {
    id: 1,
    userId: 1,
    message: "Welcome to the dashboard!",
  },
  {
    id: 2,
    userId: 1,
    message: "You have a new task.",
  },
];

async function getNotifications(userId) {
  return notifications.filter(
    (notification) => notification.userId === userId
  );
}

export {
  getNotifications,
};