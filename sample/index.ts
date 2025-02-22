import { ChannelMode } from "../src/channel";
import Message from "../src/message";
import Session from "../src/session";
import Socket from "../src/socket";
import { TOKEN } from "./token";


async function main() {
    const channelModes = [
        ChannelMode.UNRELIABLE,
        ChannelMode.SEQUENCED,
        ChannelMode.RELIABLE
    ];
    const socket = new Socket(channelModes);
    socket.setListener({
        onConnected: function (session: Session): void {
            console.log(`On connected: ${session.id}`);
            const message = Message.acquire();
            message.writeInt32(8465);
            session.send(0, message);
        },

        onDisconnected: function (session: Session): void {
            console.log(`On disconnected: ${session.id}`);
        },

        onReceived: function (session: Session, message: Message): void {
            console.log(`On received: ${session.id}`);
            console.log(`Message: ${message.size()}`);
            const value = message.readInt32();
            console.log("Message content: ", value);
        }
    });

    console.log("Start connecting...");
    const result = await socket.connect(TOKEN);
    console.log("Connect Result =", result);
}


main().catch(err => {
    console.error(err);
});
