export class BadgerUserRegistration {
    readonly username: string;
    readonly password: string;
    readonly bid: string;

    public constructor(username: string, password: string, bid: string) {
        this.username = username;
        this.password = password;
        this.bid = bid;
    }
}