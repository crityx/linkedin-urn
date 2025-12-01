"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface PostFormProps {
  accessToken: string;
  userUrn: string;
}

export function PostForm({ accessToken, userUrn }: PostFormProps) {
  const [text, setText] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!text.trim()) {
      setStatus({ type: "error", message: "Le texte ne peut pas être vide" });
      return;
    }

    setIsPosting(true);
    setStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/linkedin/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          text: text,
          authorUrn: userUrn,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Post publié avec succès sur LinkedIn!",
        });
        setText("");
      } else {
        setStatus({
          type: "error",
          message: data.error || "Erreur lors de la publication",
        });
      }
    } catch (error) {
      console.error("Erreur:", error);
      setStatus({
        type: "error",
        message: "Erreur de connexion au serveur",
      });
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="post-text"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Votre publication LinkedIn
        </label>
        <textarea
          id="post-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Écrivez votre publication ici..."
          rows={6}
          maxLength={3000}
          className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 placeholder:text-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:placeholder:text-zinc-500"
        />
        <p className="text-right text-sm text-zinc-500">
          {text.length} / 3000 caractères
        </p>
      </div>

      {status.type && (
        <div
          className={`flex items-center gap-2 rounded-lg p-3 ${
            status.type === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <p>{status.message}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isPosting || !text.trim()}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#0A66C2] px-6 py-3 text-white font-medium transition-all hover:bg-[#004182] disabled:cursor-not-allowed disabled:opacity-50 hover:scale-[1.02] hover:shadow-lg disabled:hover:scale-100"
      >
        {isPosting ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Publication en cours...
          </>
        ) : (
          <>
            <Send className="h-5 w-5" />
            Publier sur LinkedIn
          </>
        )}
      </button>
    </form>
  );
}
