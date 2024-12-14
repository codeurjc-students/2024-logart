import React, { useState, useContext } from "react";
import api from "../utilities/api";
import EditComment from "./EditComment";
import { AuthContext } from "../context/AuthContext";

const CommentItem = ({
  comment,
  onCommentUpdated,
  onCommentDeleted,
  objectOwnerId,
}) => {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const isAuthor =
    isAuthenticated && (comment.user._id === user._id || user.role === "admin");
  const isAdmin = comment.user.role === "admin";
  const isNotObjectOwner = comment.user._id !== objectOwnerId;
  const isAdminCommentOnOtherUser = isAdmin && isNotObjectOwner;
  const isEditedByAdmin = comment.isEditedByAdmin;
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "¿Estás seguro de que deseas eliminar este comentario?"
    );
    if (!confirmDelete) return;
    try {
      await api.delete(`/api/v1/comments/${comment._id}`);
      onCommentDeleted();
    } catch (err) {
      console.error("Error deleting comment:", err);
      setDeleteError(
        err.response?.data?.message || "Error al eliminar el comentario"
      );
    }
  };
  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  const handleSaveEdit = () => {
    setIsEditing(false);
    onCommentUpdated();
  };
  let backgroundClass = "bg-gray-100";
  if (isAdminCommentOnOtherUser) {
    backgroundClass = "bg-red-100 border-l-4 border-red-500";
  }
  if (isEditedByAdmin) {
    backgroundClass = "bg-yellow-100 border-l-4 border-yellow-500";
  }
  return (
    <div className={`p-4 rounded shadow ${backgroundClass} break-words`}>
      {isEditing ? (
        <EditComment
          comment={comment}
          onCancel={handleCancelEdit}
          onSave={handleSaveEdit}
        />
      ) : (
        <>
          <p
            className="text-gray-800 whitespace-pre-wrap"
            data-testid="comment-content"
          >
            {comment.content}
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Por: {comment.user.username} el{" "}
            {new Date(comment.createdAt).toLocaleDateString()}
          </p>
          {isEditedByAdmin && (
            <p className="text-orange-600 text-sm mt-1">
              Comentario editado por un administrador
            </p>
          )}
          {isAuthor && (
            <div className="mt-2 flex space-x-4">
              <button
                onClick={handleEdit}
                className="text-blue-500 hover:underline"
                data-testid="edit-comment-button"
              >
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="text-red-500 hover:underline"
                data-testid="delete-comment-button"
              >
                Eliminar
              </button>
              {deleteError && (
                <p className="text-red-500 mt-2">{deleteError}</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CommentItem;
