import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";

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
  useConfirmResolutionMutation,
  useGetTicketByIdQuery,
} from "../../features/tickets/ticketsApi";
import { uploadImage } from "../../cloudinary/uploadImage";

/* =====================================================
   MAIN – CUSTOMER CHAT
===================================================== */
function TicketChat() {
  const { ticketId } = useParams();
  const dispatch = useDispatch();
  const currentUserId = useSelector((s) => s.auth.userId);

  const [text, setText] = useState("");
  const [images, setImages] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);

  const messagesEndRef = useRef(null);
  const lastRequestIdRef = useRef(null);

  const { data } = useGetMessagesByTicketQuery(ticketId, {
    refetchOnMountOrArgChange: true,
  });

  const { data: ticket } = useGetTicketByIdQuery(ticketId);
  const messages = useSelector(selectAllMessages);

  const [sendMessage] = useSendMessageMutation();
  const [confirmResolution] = useConfirmResolutionMutation();

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
     CHAT RULES
  ===================================================== */
  const agentStarted =
    ticket?.status === "InProgress" ||
    messages.some(
      (m) =>
        m.isSystem && m.systemType === "AgentStarted"
    );

  const isClosed = messages.some(
    (m) =>
      m.isSystem &&
      m.systemType === "TicketClosed"
  );

  const chatDisabled =
    !agentStarted || isClosed;

  /* =====================================================
     SWEET ALERT CONFIRMATION
  ===================================================== */
  useEffect(() => {
    const latestRequest = [...messages]
      .reverse()
      .find(
        (m) =>
          m.isSystem &&
          m.systemType === "RequestConfirmation"
      );

    if (!latestRequest) return;
    if (
      lastRequestIdRef.current === latestRequest.id
    )
      return;

    const hasResponseAfter = messages.some(
      (m) =>
        m.isSystem &&
        (m.systemType ===
          "CustomerConfirmed" ||
          m.systemType ===
            "CustomerRejected") &&
        new Date(m.createdAt) >
          new Date(latestRequest.createdAt)
    );

    if (!hasResponseAfter) {
      lastRequestIdRef.current =
        latestRequest.id;

      Swal.fire({
        title: "Is your issue resolved?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then(async (result) => {
        await confirmResolution({
          ticketId: Number(ticketId),
          isResolved: result.isConfirmed,
        });
      });
    }
  }, [messages, confirmResolution, ticketId]);

  /* =====================================================
     IMAGE PICK
  ===================================================== */
  const handlePickImages = (e) => {
    if (chatDisabled) return;

    const files = Array.from(
      e.target.files
    ).map((file) => ({
      file,
      preview:
        URL.createObjectURL(file),
    }));

    setImages((prev) => [
      ...prev,
      ...files,
    ]);
  };

  const removeImage = (idx) => {
    URL.revokeObjectURL(
      images[idx].preview
    );
    setImages((prev) =>
      prev.filter((_, i) => i !== idx)
    );
  };

  /* =====================================================
     SEND MESSAGE
  ===================================================== */
  const handleSend = async () => {
    if (chatDisabled) return;
    if (!text.trim() && images.length === 0)
      return;

    const imageUrls = [];

    for (const img of images) {
      imageUrls.push(
        await uploadImage(img.file)
      );
      URL.revokeObjectURL(
        img.preview
      );
    }

    dispatch(
      addMessage({
        id: crypto.randomUUID(),
        ticketId: Number(ticketId),
        senderId: currentUserId,
        message: text,
        isSystem: false,
        createdAt:
          new Date().toISOString(),
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
        title={`Ticket #${ticketId}`}
        messages={messages}
        currentUserId={
          currentUserId
        }
        ticket={ticket}
        text={text}
        setText={setText}
        images={images}
        onPickImages={
          handlePickImages
        }
        onRemoveImage={
          removeImage
        }
        onSend={handleSend}
        disabled={chatDisabled}
        onImageClick={
          setPreviewImage
        }
        messagesEndRef={
          messagesEndRef
        }
      />

      {previewImage && (
        <ImageModal
          src={previewImage}
          onClose={() =>
            setPreviewImage(null)
          }
        />
      )}
    </>
  );
}

export default TicketChat;

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
  disabled,
  onImageClick,
  messagesEndRef,
}) {
  return (
    <div className="container-fluid d-flex justify-content-center align-items-center"
      style={{
        backgroundColor:
          "#f5f2ed",
        height:
          "calc(100vh - 56px)",
      }}>

      <div className="d-flex flex-column shadow-sm"
        style={{
          width: "100%",
          maxWidth: "1400px",
          height: "80vh",
          backgroundColor:
            "#FBF7F2",
          borderRadius: 16,
          border:
            "1px solid #ddd",
        }}>

        <div className="px-4 py-3 border-bottom fw-semibold">
          {title}
        </div>

        <div className="flex-grow-1 px-4 py-3 overflow-auto">
          {messages.map((m) =>
            m.isSystem ? (
              <SystemMessage
                key={m.id}
                text={m.message}
              />
            ) : (
              <UserMessage
                key={m.id}
                message={m}
                currentUserId={
                  currentUserId
                }
                ticket={ticket}
                onImageClick={
                  onImageClick
                }
              />
            )
          )}
          <div
            ref={messagesEndRef}
          />
        </div>

        <div className="px-3 py-3 border-top bg-light d-flex gap-2 align-items-end">
          <input
            type="file"
            multiple
            disabled={disabled}
            onChange={
              onPickImages
            }
          />

          <textarea
            className="form-control"
            value={text}
            disabled={disabled}
            rows={1}
            style={{
              resize: "none",
              maxHeight: 90,
            }}
            onChange={(e) =>
              setText(
                e.target.value
              )
            }
          />

          <button
            className="btn btn-dark"
            onClick={onSend}
            disabled={disabled}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

/* =====================================================
   USER MESSAGE
===================================================== */
function UserMessage({
  message,
  currentUserId,
  ticket,
  onImageClick,
}) {
  const isMine =
    String(message.senderId) ===
    String(currentUserId);

  const isAgent =
    message.senderRole ===
    "Agent";

  const isPrimaryAgent =
    isAgent &&
    String(message.senderId) ===
      String(
        ticket?.primaryAgentId
      );

  const alignment = isMine
    ? "justify-content-end"
    : "justify-content-start";

  let bgColor = "#ffffff";

  if (isMine) bgColor = "#212529";
  else if (isPrimaryAgent)
    bgColor = "#dbeafe";
  else if (isAgent)
    bgColor = "#eef2ff";

  const textColor =
    isMine ? "#fff" : "#000";

  return (
    <div className={`d-flex mb-3 ${alignment}`}>
      {!isMine && (
        <div className="me-2">
          {isAgent ? (
            <AvatarAgent />
          ) : (
            <AvatarCustomer />
          )}
        </div>
      )}

      <div
        style={{
          maxWidth: "65%",
          backgroundColor:
            bgColor,
          color: textColor,
          padding:
            "12px 16px",
          borderRadius: 14,
        }}>

        {!isMine && isAgent && (
          <div style={{
            fontSize: 11,
            fontWeight: 600,
            marginBottom: 4,
          }}>
            {isPrimaryAgent
              ? "Primary • "
              : "Secondary • "}
            {message.senderEmail?.split(
              "@"
            )[0]}
          </div>
        )}

        {message.message && (
          <div className="mb-2">
            {message.message}
          </div>
        )}

        {message.imageUrls?.map(
          (img, i) => (
            <img
              key={i}
              src={img}
              width={120}
              style={{
                cursor: "pointer",
                borderRadius: 8,
              }}
              onClick={() =>
                onImageClick(
                  img
                )
              }
            />
          )
        )}
      </div>

      {isMine && (
        <div className="ms-2">
          <AvatarCustomer />
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
        backgroundColor:
          "#e9ecef",
        padding:
          "12px 26px",
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
const AvatarCustomer = () => (
  <div className="ms-2 rounded-circle bg-dark text-white d-flex align-items-center justify-content-center"
    style={{ width: 32, height: 32 }}>
    ME
  </div>
);

const AvatarAgent = () => (
  <div className="me-2 rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
    style={{ width: 32, height: 32 }}>
    🎧
  </div>
);

/* =====================================================
   IMAGE MODAL
===================================================== */
function ImageModal({
  src,
  onClose,
}) {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
      style={{
        background:
          "rgba(0,0,0,0.85)",
      }}
      onClick={onClose}>
      <img
        src={src}
        style={{
          maxHeight: "90%",
          maxWidth: "90%",
        }}
      />
    </div>
  );
}
