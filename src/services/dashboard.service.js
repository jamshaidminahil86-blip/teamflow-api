import { getUser } from "./user.service.js";
import { getProjects } from "./project.service.js";
import { getTasks } from "./task.service.js";
import { getNotifications } from "./notification.service.js";

async function getDashboard(userId) {
  const [
    user,
    projects,
    tasks,
    notifications,
  ] = await Promise.all([
    getUser(userId),
    getProjects(userId),
    getTasks(userId),
    getNotifications(userId),
  ]);

  return {
    user,
    projects,
    tasks,
    notifications,
  };
}

export {
  getDashboard,
};