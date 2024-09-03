// "use client";

// import { useState, useEffect } from "react";
// import { useSession } from "next-auth/react";
// import moment from "moment-timezone";

// type Comment = {
//   id: string;
//   content: string;
//   createdAt: string;
//   updatedAt: string;
//   author: {
//     name: string;
//   };
// };

// export default function CommentSection({ articleId }: { articleId: string }) {
//   const [comments, setComments] = useState<Comment[]>([]);
//   const [newComment, setNewComment] = useState("");
//   const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
//   const [editedContent, setEditedContent] = useState("");
//   const { data: session } = useSession();

//   useEffect(() => {
//     fetchComments();
//   }, [articleId]);

//   const fetchComments = async () => {
//     const response = await fetch(`/api/comments?articleId=${articleId}`);
//     if (response.ok) {
//       const data = await response.json();
//       setComments(data);
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newComment.trim()) return;

//     const response = await fetch("/api/comments", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ content: newComment, articleId }),
//     });

//     if (response.ok) {
//       setNewComment("");
//       fetchComments();
//     }
//   };

//   const handleEdit = (commentId: string, content: string) => {
//     setEditingCommentId(commentId);
//     setEditedContent(content);
//   };

//   const handleSaveEdit = async () => {
//     if (!editingCommentId || !editedContent.trim()) return;

//     const response = await fetch(`/api/comments/${editingCommentId}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ content: editedContent }),
//     });

//     if (response.ok) {
//       setEditingCommentId(null);
//       setEditedContent("");
//       fetchComments();
//     }
//   };

//   const handleDelete = async (commentId: string) => {
//     const response = await fetch(`/api/comments/${commentId}`, {
//       method: "DELETE",
//     });

//     if (response.ok) {
//       fetchComments();
//     }
//   };

//   const isAdmin = session?.user?.role === "ADMIN";

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-4">Comments</h2>
//       {comments.map((comment) => (
//         <div key={comment.id} className="mb-4 p-4 bg-gray-100 rounded">
//           {editingCommentId === comment.id ? (
//             <>
//               <textarea
//                 value={editedContent}
//                 onChange={(e) => setEditedContent(e.target.value)}
//                 className="w-full p-2 border rounded"
//                 rows={3}
//               />
//               <button
//                 onClick={handleSaveEdit}
//                 className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
//               >
//                 Save
//               </button>
//             </>
//           ) : (
//             <>
//               <p
//                 className="break-words"
//                 dangerouslySetInnerHTML={{ __html: comment.content }}
//               />
//               <p className="text-sm text-gray-500">
//                 By {comment.author.name} on{" "}
//                 {moment
//                   .tz(comment.createdAt, "Asia/Tokyo")
//                   .format("YYYY/MM/DD dddd HH:mm")}
//                 {comment.updatedAt &&
//                   new Date(comment.updatedAt).getTime() !==
//                     new Date(comment.createdAt).getTime() && (
//                     <span>
//                       {" "}
//                       (edited on{" "}
//                       {moment
//                         .tz(comment.updatedAt, "Asia/Tokyo")
//                         .format("YYYY/MM/DD dddd HH:mm")}
//                       )
//                     </span>
//                   )}
//               </p>
//               {session && session.user.name === comment.author.name && (
//                 <button
//                   onClick={() => handleEdit(comment.id, comment.content)}
//                   className="mr-2 mt-2 px-4 py-2 bg-yellow-500 text-white rounded"
//                 >
//                   Edit
//                 </button>
//               )}
//               {session &&
//                 (session.user.name === comment.author.name || isAdmin) && (
//                   <>
//                     <button
//                       onClick={() => handleDelete(comment.id)}
//                       className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
//                     >
//                       Delete
//                     </button>
//                   </>
//                 )}
//             </>
//           )}
//         </div>
//       ))}
//       {session ? (
//         <form onSubmit={handleSubmit} className="mt-4">
//           <textarea
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//             className="w-full p-2 border rounded"
//             rows={3}
//             placeholder="Add a comment..."
//           />
//           <button
//             type="submit"
//             className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
//           >
//             Post Comment
//           </button>
//         </form>
//       ) : (
//         <p>Please sign in to leave a comment.</p>
//       )}
//     </div>
//   );
// }





"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import moment from "moment-timezone";

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
  };
};

export default function CommentSection({ articleId }: { articleId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const { data: session } = useSession();

  const fetchComments = useCallback(async () => {
    const response = await fetch(`/api/comments?articleId=${articleId}`);
    if (response.ok) {
      const data = await response.json();
      setComments(data);
    }
  }, [articleId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const response = await fetch("/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: newComment, articleId }),
    });

    if (response.ok) {
      setNewComment("");
      fetchComments();
    }
  };

  const handleEdit = (commentId: string, content: string) => {
    setEditingCommentId(commentId);
    setEditedContent(content);
  };

  const handleSaveEdit = async () => {
    if (!editingCommentId || !editedContent.trim()) return;

    const response = await fetch(`/api/comments/${editingCommentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: editedContent }),
    });

    if (response.ok) {
      setEditingCommentId(null);
      setEditedContent("");
      fetchComments();
    }
  };

  const handleDelete = async (commentId: string) => {
    const response = await fetch(`/api/comments/${commentId}`, {
      method: "DELETE",
    });

    if (response.ok) {
      fetchComments();
    }
  };

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Comments</h2>
      {comments.map((comment) => (
        <div key={comment.id} className="mb-4 p-4 bg-gray-100 rounded">
          {editingCommentId === comment.id ? (
            <>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-2 border rounded"
                rows={3}
              />
              <button
                onClick={handleSaveEdit}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <p className="break-words">{comment.content}</p>
              <p className="text-sm text-gray-500">
                By {comment.author.name} on{" "}
                {moment
                  .tz(comment.createdAt, "Asia/Tokyo")
                  .format("YYYY/MM/DD dddd HH:mm")}
                {comment.updatedAt &&
                  new Date(comment.updatedAt).getTime() !==
                    new Date(comment.createdAt).getTime() && (
                    <span>
                      {" "}
                      (edited on{" "}
                      {moment
                        .tz(comment.updatedAt, "Asia/Tokyo")
                        .format("YYYY/MM/DD dddd HH:mm")}
                      )
                    </span>
                  )}
              </p>
              {session?.user?.name === comment.author.name && (
                <button
                  onClick={() => handleEdit(comment.id, comment.content)}
                  className="mr-2 mt-2 px-4 py-2 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
              )}
              {(session?.user?.name === comment.author.name || isAdmin) && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              )}
            </>
          )}
        </div>
      ))}
      {session ? (
        <form onSubmit={handleSubmit} className="mt-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
            placeholder="Add a comment..."
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Post Comment
          </button>
        </form>
      ) : (
        <p>Please sign in to leave a comment.</p>
      )}
    </div>
  );
}
