import { Express } from 'express';

import { CS571Route } from "@cs571/s24-api-framework/src/interfaces/route";
import { CS571HW11DbConnector } from '../services/hw11-db-connector';

export class CS571GetMessagesRoute implements CS571Route {

    public static readonly ROUTE_NAME: string = '/messages';

    private readonly connector: CS571HW11DbConnector;
    private readonly chatrooms: string[];

    public constructor(chatrooms: string[], connector: CS571HW11DbConnector) {
        this.chatrooms = chatrooms;
        this.connector = connector;
    }

    public addRoute(app: Express): void {
        app.get(CS571GetMessagesRoute.ROUTE_NAME, async (req, res) => {
            const chatroom = (req.query.chatroom || "") as string;
            const numPosts = parseInt((req.query.num || "1") as string);
            if (chatroom && !this.chatrooms.includes(chatroom)) {
                res.status(404).send({
                    msg: "The specified chatroom does not exist. Chatroom names are case-sensitive."
                });
                return;
            }

            if (isNaN(numPosts) || numPosts < 1 || numPosts > 10) {
                res.status(400).send({
                    msg: "Only between 1 and 10 posts may be returned."
                });
                return;
            }

            const messages = await (chatroom ? this.connector.getMessages(chatroom) : this.connector.getAllMessages())

            res.status(200).send({
                msg: "Successfully got the latest messages!",
                messages: messages.slice(0, numPosts)
            });
        })
    }

    public getRouteName(): string {
        return CS571GetMessagesRoute.ROUTE_NAME;
    }
}
