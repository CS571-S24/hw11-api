import { Express } from 'express';

import { CS571Route } from "@cs571/s24-api-framework/src/interfaces/route";
import { CS571HW11DbConnector } from '../services/hw11-db-connector';
import { BadgerUserRegistration } from '../model/badger-user-registration';
import { CS571HW11TokenAgent } from '../services/hw11-token-agent';
import { CS571Config } from '@cs571/s24-api-framework';
import HW11PublicConfig from '../model/configs/hw11-public-config';
import HW11SecretConfig from '../model/configs/hw11-secret-config';

export class CS571RegisterRoute implements CS571Route {

    public static readonly ROUTE_NAME: string = '/register';

    private readonly connector: CS571HW11DbConnector;
    private readonly tokenAgent: CS571HW11TokenAgent;
    private readonly config: CS571Config<HW11PublicConfig, HW11SecretConfig>


    public constructor(connector: CS571HW11DbConnector, tokenAgent: CS571HW11TokenAgent, config: CS571Config<HW11PublicConfig, HW11SecretConfig>) {
        this.connector = connector;
        this.tokenAgent = tokenAgent;
        this.config = config;
    }

    public addRoute(app: Express): void {
        app.post(CS571RegisterRoute.ROUTE_NAME, async (req, res) => {
            // Note to the curious reader: In this API, we use SHA256 instead of bcrypt. This is not preferable.
            // Typically, we prefer a computationally-expensive hashing algorithm for passwords to weaken enumeration attacks.
            // However, my resources are limited. Using SHA-256 will preserve the privacy of "complex" passwords, though
            // less "complex" passwords will be easier to enumerate in case of leakage.

            const username = req.body.username?.trim();
            const password = req.body.password?.trim();

            if (!username || !password) {
                res.status(400).send({
                    msg:  "A request must contain a 'username' and 'password'"
                });
                return;
            }

            if (username.length > 64 || password.length > 128) {
                res.status(413).send({
                    msg: "'username' must be 64 characters or fewer and 'password' must be 128 characters or fewer"
                });
                return;
            }

            const alreadyExists = await this.connector.findUserIfExists(username);

            if (alreadyExists) {
                res.status(409).send({
                    msg: "The user already exists!"
                });
                return;
            }

            const badgerUser = await this.connector.createBadgerUser(new BadgerUserRegistration(username, password, req.header("X-CS571-ID") as string));
            const cook = this.tokenAgent.generateAccessToken(badgerUser);

            res.status(200).cookie(
                'badgerchat_auth',
                cook,
                {
                    domain: this.config.PUBLIC_CONFIG.IS_REMOTELY_HOSTED ? 'cs571.org' : undefined,
                    sameSite: this.config.PUBLIC_CONFIG.IS_REMOTELY_HOSTED ? "none" : "lax",
                    secure: this.config.PUBLIC_CONFIG.IS_REMOTELY_HOSTED,
                    partitioned: true,
                    maxAge: 3600000,
                    httpOnly: true,
                }
            ).send(
                {
                    msg: "Successfully authenticated.",
                    user: badgerUser,
                    eat: this.tokenAgent.getExpFromToken(cook)
                }
            );
        })
    }

    public getRouteName(): string {
        return CS571RegisterRoute.ROUTE_NAME;
    }
}
