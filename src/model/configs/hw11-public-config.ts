import { CS571DefaultPublicConfig } from "@cs571/s24-api-framework";

export default interface HW11PublicConfig extends CS571DefaultPublicConfig {
    IS_REMOTELY_HOSTED: boolean;
    PASSWORDS_LOC: string;
}