import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { ENV } from "../configs/constant.js";
import ejs from "ejs";
import fs from "fs";
import path from "path";
const __dirname = path.resolve();

const SES_CONFIG = {
  credentials: {
    accessKeyId: ENV.AWS_ACCESS_KEY,
    secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
  },
  region: ENV.AWS_REGION,
};

const sesClient = new SESClient(SES_CONFIG);

class emailService {
  async sendTicketCreateEamil(to, name, topic, resolution, ticketId) {
    try {
    
      const body = "sendTicketEmail";

      const templatePath = path.join(__dirname, "views", "index.ejs");

      const root = path.join(__dirname, "views");
      const template = fs.readFileSync(templatePath, "utf-8");
      const htmlContent = ejs.render(template, {
        root,
        body,
        name, topic, resolution, ticketId
      });
      const params = {
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: htmlContent,
            },
            Text: {
              Data: `Hi there! Please complete the verification process`,
            },
          },
          Subject: {
            Data: `Support Ticket Created: #${ticketId}`,
          },
        },
        Source: process.env.AWS_SENDER,
      };

      const sendEmailCommand = new SendEmailCommand(params);
      let res = await sesClient.send(sendEmailCommand);
      res = res.$metadata.httpStatusCode;

      if (res === 200) {
        return true;
      } else {
        console.error("Failed to send email, status code:", res);
        return false;
      }
    } catch (error) {
      console.error("Error in sendSignUpEmail:", error);
      return false;
    }
  }
  async sendResolvedEamil(to, name, topic, resolution, ticketId,comment) {
    try {
       const adminComment=comment;
      const body = "sendResolvedEmail";

      const templatePath = path.join(__dirname, "views", "index.ejs");

      const root = path.join(__dirname, "views");
      const template = fs.readFileSync(templatePath, "utf-8");
      const htmlContent = ejs.render(template, {
        root,
        body,
        name, topic, resolution, ticketId,adminComment
      });
      const params = {
        Destination: {
          ToAddresses: [to],
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: htmlContent,
            },
            Text: {
              Data: `Hi there! Please complete the verification process`,
            },
          },
          Subject: {
            Data: `Ticket #${ticketId} Resolved: ${topic}`,
          },
        },
        Source: process.env.AWS_SENDER,
      };

      const sendEmailCommand = new SendEmailCommand(params);
      let res = await sesClient.send(sendEmailCommand);
      res = res.$metadata.httpStatusCode;

      if (res === 200) {
        return true;
      } else {
        console.error("Failed to send email, status code:", res);
        return false;
      }
    } catch (error) {
      console.error("Error in sendSignUpEmail:", error);
      return false;
    }
  }
}

export default new emailService();
