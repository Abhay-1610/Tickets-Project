import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { startSignalR, stopSignalR } from "../../signalR/signalRService";
import {
  useGetMessagesByTicketQuery,
} from "../../features/messages/messagesApi";
import {
  setMessages,
  clearMessages,
  selectAllMessages,
} from "../../features/messages/messagesSlice";
import { useGetTicketByIdQuery } from "../../features/tickets/ticketsApi";

/* =========================
   MAIN (ADMIN – READ ONLY)
========================= */
function AdminTicketChat() {
  const { ticketId } = useParams();
  const dispatch = useDispatch();

  const messages = useSelector(selectAllMessages);

  // get ticket to know customerId
  const { data: ticket } = useGetTicketByIdQuery(ticketId);

  const { data } = useGetMessagesByTicketQuery(ticketId, {
    refetchOnMountOrArgChange: true,
  });

  /* =========================
     LOAD CHAT HISTORY
  ========================= */
  useEffect(() => {
    if (!data) return;
    dispatch(clearMessages());
    dispatch(setMessages(data));
  }, [data, dispatch]);

  /* =========================
     SIGNALR (READ ONLY)
  ========================= */
  useEffect(() => {
    if (!data) return;

    // admin joins group but never sends
    startSignalR(dispatch, ticketId, "ADMIN_READ_ONLY");

    return () => {
      stopSignalR(ticketId);
      dispatch(clearMessages());
    };
  }, [dispatch, ticketId, data]);

  return (
    <ChatLayout
      title={`Ticket #${ticketId} — Admin (Read Only)`}
      messages={messages}
      customerId={ticket?.customerId}
    />
  );
}

export default AdminTicketChat;

/* =========================
   UI COMPONENTS
========================= */

function ChatLayout({
  title,
  messages,
  customerId,
}) {
  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "#f5f2ed", height: "calc(100vh - 56px)" }}
    >
      <div
        className="d-flex flex-column shadow-sm"
        style={{
          width: "100%",
          maxWidth: "1400px",
          height: "80vh",
          backgroundColor: "#FBF7F2",
          borderRadius: "16px",
          border: "1px solid #ddd",
        }}
      >
        {/* HEADER */}
        <div className="px-4 py-3 border-bottom fw-semibold">
          {title}
        </div>

        {/* CHAT BODY */}
        <div
          className="flex-grow-1 px-4 py-3"
          style={{ overflowY: "auto" }}
        >
          {messages.map((m) =>
            m.isSystem ? (
              <SystemMessage key={m.id} text={m.message} />
            ) : (
              <UserBubble
                key={m.id}
                // CUSTOMER LEFT, AGENT RIGHT
                mine={String(m.senderId) !== String(customerId)}
                text={m.message}
                images={m.imageUrls}
              />
            )
          )}
        </div>

        {/* FOOTER NOTE (NO INPUT) */}
        <div className="px-4 py-3 border-top bg-light text-center text-muted small">
          Admin view only. Chat is read-only.
        </div>
      </div>
    </div>
  );
}

function SystemMessage({ text }) {
  return (
    <div className="d-flex justify-content-center mb-4">
      <div
        style={{
          backgroundColor: "#e9ecef",
          padding: "12px 26px",
          borderRadius: "16px",
          fontWeight: 500,
        }}
      >
        {text}
      </div>
    </div>
  );
}

function UserBubble({ mine, text, images = [] }) {
  return (
    <div
      className={`d-flex mb-3 ${
        mine ? "justify-content-end" : "justify-content-start"
      }`}
    >
      <div
        style={{
          maxWidth: "65%",
          backgroundColor: mine ? "#212529" : "#fff",
          color: mine ? "#fff" : "#000",
          padding: "12px 16px",
          borderRadius: "14px",
          border: mine ? "none" : "1px solid #ddd",
        }}
      >
        {text && <div className="mb-2">{text}</div>}

        {images.length > 0 && (
          <div className="d-flex gap-2 flex-wrap">
            {images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                width={120}
                style={{
                  cursor: "pointer",
                  borderRadius: 8,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
