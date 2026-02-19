import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { startSignalR, stopSignalR } from "../../signalR/signalRService";
import {
  useGetMessagesByTicketQuery,
  useSendMessageMutation,
} from "../../features/messages/messagesApi";
import {
  setMessages,
  addMessage,
  clearMessages,
  selectAllMessages,
} from "../../features/messages/messagesSlice";
import {
  useRequestConfirmationMutation,
  useUpdateTicketStatusMutation,
  useGetTicketByIdQuery,
} from "../../features/tickets/ticketsApi";
import { uploadImage } from "../../cloudinary/uploadImage";

/* =====================================================
   MAIN – AGENT CHAT
===================================================== */
function AgentTicketChat() {
  const { ticketId } = useParams();
  const dispatch = useDispatch();
  const currentUserId = useSelector((s) => s.auth.userId);

  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const messagesEndRef = useRef(null);

  const { data } = useGetMessagesByTicketQuery(ticketId, {
    refetchOnMountOrArgChange: true,
  });

  const { data: ticket } = useGetTicketByIdQuery(ticketId);

  const messages = useSelector(selectAllMessages);

  const [sendMessage] = useSendMessageMutation();
  const [requestConfirmation] = useRequestConfirmationMutation();
  const [updateStatus] = useUpdateTicketStatusMutation();

  /* =====================================================
     LOAD HISTORY
  ===================================================== */
  useEffect(() => {
    if (!data) return;
    dispatch(clearMessages());
    dispatch(setMessages(data));
  }, [data, dispatch]);

  /* =====================================================
     SIGNALR
  ===================================================== */
  useEffect(() => {
    if (!data) return;

    stopSignalR();
    startSignalR(dispatch, ticketId, currentUserId);

    return () => {
      stopSignalR();
      dispatch(clearMessages());
    };
  }, [dispatch, ticketId, currentUserId, data]);

  /* =====================================================
     AUTO SCROLL
  ===================================================== */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =====================================================
     TICKET STATE
  ===================================================== */
  const isClosed = messages.some(
    (m) => m.isSystem && m.systemType === "TicketClosed"
  );

  const canCloseTicket = messages.some(
    (m) => m.isSystem && m.systemType === "CustomerConfirmed"
  );

  const isPrimaryAgent =
    ticket &&
    String(ticket.primaryAgentId) === String(currentUserId);

  /* =====================================================
     IMAGE PICK
  ===================================================== */
  const pickImages = (e) => {
    if (isClosed) return;

    const files = Array.from(e.target.files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (idx) => {
    URL.revokeObjectURL(images[idx].preview);
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  /* =====================================================
     SEND MESSAGE
  ===================================================== */
  const handleSend = async () => {
    if (isClosed) return;
    if (!text.trim() && images.length === 0) return;

    const imageUrls = [];

    for (const img of images) {
      imageUrls.push(await uploadImage(img.file));
      URL.revokeObjectURL(img.preview);
    }

    dispatch(
      addMessage({
        id: crypto.randomUUID(),
        ticketId: Number(ticketId),
        senderId: currentUserId,
        message: text,
        isSystem: false,
        createdAt: new Date().toISOString(),
        imageUrls,
      })
    );

    setText("");
    setImages([]);

    await sendMessage({
      ticketId: Number(ticketId),
      message: text,
      imageUrls,
    });
  };

  /* =====================================================
     RENDER
  ===================================================== */
  return (
    <>
      <ChatLayout
        title={`Ticket -${ticketId} -- Raised By--`}
        messages={messages}
        currentUserId={currentUserId}
        ticket={ticket}
        text={text}
        setText={setText}
        images={images}
        onPickImages={pickImages}
        onRemoveImage={removeImage}
        onSend={handleSend}
        disabled={isClosed}
        onImageClick={setPreviewImage}
        messagesEndRef={messagesEndRef}
        footerExtra={
          !isClosed && isPrimaryAgent && (
            <>
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() =>
                  requestConfirmation(Number(ticketId))
                }
              >
                Request Confirmation
              </button>

              {canCloseTicket && (
                <button
                  className="btn btn-success btn-sm"
                  onClick={() =>
                    updateStatus({
                      ticketId: Number(ticketId),
                      status: "Closed",
                    })
                  }
                >
                  Close Ticket
                </button>
              )}
            </>
          )
        }
      />

      {previewImage && (
        <ImageModal
          src={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </>
  );
}

export default AgentTicketChat;

/* =====================================================
   CHAT LAYOUT
===================================================== */
function ChatLayout({
  title,
  messages,
  currentUserId,
  ticket,
  text,
  setText,
  images,
  onPickImages,
  onRemoveImage,
  onSend,
  footerExtra,
  disabled,
  onImageClick,
  messagesEndRef,
}) {
  return (
    <div className="container-fluid d-flex justify-content-center align-items-center"
      style={{ backgroundColor: "#f5f2ed", height: "calc(100vh - 56px)" }}>

      <div className="d-flex flex-column shadow-sm"
        style={{
          width: "100%",
          maxWidth: "1400px",
          height: "80vh",
          backgroundColor: "#FBF7F2",
          borderRadius: 16,
          border: "1px solid #ddd",
        }}>

        <div className="px-4 py-3 border-bottom fw-semibold">
          {title} {ticket.customerEmail?.split("@")[0]}

        </div>

        <div className="flex-grow-1 px-4 py-3 overflow-auto">
          {messages.map((m) =>
            m.isSystem ? (
              <SystemMessage key={m.id} text={m.message} />
            ) : (
              <UserBubble
                key={m.id}
                message={m}
                currentUserId={currentUserId}
                ticket={ticket}
                onImageClick={onImageClick}
              />
            )
          )}
          <div ref={messagesEndRef} />
        </div>
{/* IMAGE PREVIEW SECTION */}
{/* IMAGE PREVIEW ROW - FIXED */}
{images.length > 0 && (
  <div
    style={{
      display: "flex",
      gap: 10,
      overflowX: "auto",      // horizontal scroll only inside
      paddingBottom: 6,
      maxWidth: "100%",
    }}
  >
    {images.map((img, i) => (
      <div
        key={i}
        style={{
          position: "relative",
          minWidth: 80,
          height: 80,
        }}
      >
        <img
          src={img.preview}
          style={{
            width: 80,
            height: 80,
            objectFit: "cover",
            borderRadius: 8,
            border: "1px solid #ddd",
          }}
        />

        <button
          type="button"
          onClick={() => onRemoveImage(i)}
          style={{
            position: "absolute",
            top: -6,
            right: -6,
            width: 22,
            height: 22,
            borderRadius: "50%",
            border: "none",
            background: "#dc3545",
            color: "#fff",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>
    ))}
  </div>
)}



        <div className="px-3 py-3 border-top bg-light d-flex gap-2 align-items-end">
          <input type="file" multiple disabled={disabled} onChange={onPickImages} />

          <textarea
            className="form-control"
            value={text}
            disabled={disabled}
            rows={1}
            style={{ resize: "none", maxHeight: 90 }}
            onChange={(e) => setText(e.target.value)}
          />

          <button className="btn btn-dark" onClick={onSend} disabled={disabled}>
            Send
          </button>

          {footerExtra}
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   USER BUBBLE
===================================================== */
function UserBubble({ message, currentUserId, ticket, onImageClick }) {
  const isMine =
    String(message.senderId) === String(currentUserId);

  const isAgent = message.senderRole === "Agent";

  const isPrimaryAgent =
    isAgent &&
    String(message.senderId) ===
      String(ticket?.primaryAgentId);

  const alignment = isMine
    ? "justify-content-end"
    : "justify-content-start";

  let bgColor = "#ffffff";

  if (isMine) bgColor = "#212529";
  else if (isPrimaryAgent) bgColor = "#dbeafe";
  else if (isAgent) bgColor = "#eef2ff";

  const textColor = isMine ? "#fff" : "#000";

  return (
    <div className={`d-flex mb-3 ${alignment}`}>
      {!isMine && (
        <div className="me-2">
          {isAgent ? <AvatarAgent /> : <AvatarCustomer />}
        </div>
      )}

      <div
        style={{
          maxWidth: "65%",
          backgroundColor: bgColor,
          color: textColor,
          padding: "12px 16px",
          borderRadius: 14,
        }}>

        {/* MESSAGE HEADER (Name + Role) */}
{!isMine && (
  <div
    style={{
      fontSize: 11,
      fontWeight: 600,
      marginBottom: 4,
    }}
  >
    {isAgent ? (
      <>
        {isPrimaryAgent ? "Primary • " : "Secondary • "}
        {message.senderEmail?.split("@")[0]}
      </>
    ) : (
      <>
        Customer • {message.senderEmail?.split("@")[0]}
      </>
    )}
  </div>
)}


        {message.message && (
          <div className="mb-2">{message.message}</div>
        )}

        {message.imageUrls?.map((img, i) => (
          <img
            key={i}
            src={img}
            width={120}
            style={{ cursor: "pointer", borderRadius: 8 }}
            onClick={() => onImageClick(img)}
          />
        ))}
      </div>

      {isMine && (
        <div className="ms-2">
          {isAgent ? <AvatarAgent /> : <AvatarCustomer />}
        </div>
      )}
    </div>
  );
}

/* =====================================================
   SYSTEM MESSAGE
===================================================== */
function SystemMessage({ text }) {
  return (
    <div className="d-flex justify-content-center mb-4">
      <div style={{
        backgroundColor: "#e9ecef",
        padding: "12px 26px",
        borderRadius: 16,
        fontWeight: 500,
      }}>
        {text}
      </div>
    </div>
  );
}

/* =====================================================
   AVATARS
===================================================== */
const AvatarAgent = () => (
  <div className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
    style={{ width: 32, height: 32 }}>
    🎧
  </div>
);

const AvatarCustomer = () => (
  <div className="rounded-circle bg-white d-flex align-items-center justify-content-center"
    style={{
      width: 32,
      height: 32,
      border: "1px solid #ccc",
    }}>
    👤
  </div>
);

/* =====================================================
   IMAGE MODAL
===================================================== */
function ImageModal({ src, onClose }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.9)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999, // important
      }}
    >
      <img
        src={src}
        onClick={(e) => e.stopPropagation()} // prevent close on image click
        style={{
          maxWidth: "90%",
          maxHeight: "90%",
          borderRadius: 12,
          boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
        }}
      />
    </div>
  );
}

 