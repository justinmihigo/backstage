import { notificationService } from '@backstage/plugin-notifications-node';
import {createBackendPlugin} from '@backstage/backend-plugin-api'
// import { Notification } from '@backstage/plugin-notifications-common';
// import nodemailer from 'nodemailer'
// import { notificationsProcessingExtensionPoint } from '@backstage/plugin-notifications-node';
// class MyNotificationProcessor implements NotificationProcessor {
//   // preProcess is called before the notification is saved to database.
//   // This is a good place to modify the notification before it is saved and sent to the user.
//   getName(): string {
//       return 'justinmihigo'
//   }
//   async preProcess(notification: Notification): Promise<Notification> {
//     if (notification.origin === 'scaffolder') {
//       notification.payload.icon = 'notifications';
//     }
//     return notification;
//   }

//   // postProcess is called after the notification is saved to database and the signal is emitted.
//   // This is a good place to send the notification to external services.
//   async postProcess(notification: Notification): Promise<void> {
//     nodemailer.createTransport({
//       from: 'backstage',
//       to: 'user',
//       subject: notification.payload.title || "Notification",
//       text: notification.payload.description ||  "From Scaffolder", 
//     });
//   }
// }

export const notificationsPlugin = createBackendPlugin({
  pluginId: 'myplugin',
  register(env) {
    env.registerInit({
      deps: {
        notifications: notificationService,
        // ...
      },
      async init({ notifications }) {
        // ...
        await notifications.send({
            recipients: {type:'broadcast'},
            payload: {
                title: 'Notification',
                description:'Notifications initiated successfully',
                severity: 'low',
                topic: 'Backstage'
            }
        })
      },
    });
  },
});