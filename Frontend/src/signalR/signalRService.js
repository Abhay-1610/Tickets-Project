import * as signalR from "@microsoft/signalr";
import { addMessage } from "../features/messages/messagesSlice";

let connection = null;
let starting = false;

/* =========================
   START SIGNALR (SAFE)
========================= */
export const startSignalR = async (dispatch, ticketId, currentUserId) => {
  // hard guards
  if (connection || starting) return;

  starting = true;

  const hubUrl =
    `${import.meta.env.VITE_API_BASE_URL.replace("/api", "")}/hubs/tickets`;

  const newConnection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: () => localStorage.getItem("accessToken"),
    })
    .withAutomaticReconnect()
    .build();

  // handlers (fresh instance → no off() needed)
  newConnection.on("MessageReceived", (message) => {
    if (String(message.senderId) === String(currentUserId)) return;
    dispatch(addMessage(message));
  });

  newConnection.on("SystemMessage", (message) => {
    dispatch(addMessage(message));
  });

  try {
    await newConnection.start();              // negotiate
    await newConnection.invoke(
      "JoinTicket",
      Number(ticketId)
    );                                        // join group

    connection = newConnection;               // set ONLY after success
    console.log("SignalR connected");
  } catch (err) {
    console.error("SignalR start failed", err);
    try {
      await newConnection.stop();
    } catch {}
  } finally {
    starting = false;
  }
};

/* =========================
   STOP SIGNALR (SAFE)
========================= */
export const stopSignalR = async () => {
  if (!connection) return;

  const conn = connection;
  connection = null; // break race immediately

  try {
    if (conn.state === signalR.HubConnectionState.Connected) {
      await conn.stop();
    }
  } catch (err) {
    console.warn("SignalR stop error", err);
  }
};
