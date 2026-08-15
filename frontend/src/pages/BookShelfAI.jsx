import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

const QUICK_PROMPTS = [
  "What should I read next?",
  "Something similar to my favorites",
  "Surprise me",
  "Something darker",
  "Recommend a new genre",
];

function BookShelfAI() {
  const navigate = useNavigate();
  const location = useLocation();

  const [recommendations, setRecommendations] = useState([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] =
    useState(true);
  const [recommendationError, setRecommendationError] = useState("");
  const [recommendationsLoaded, setRecommendationsLoaded] = useState(false);

  const [conversation, setConversation] = useState([]);
  const [draftMessage, setDraftMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [chatError, setChatError] = useState("");
  const [lastPrompt, setLastPrompt] = useState("");

  useEffect(() => {
    const initialPrompt = location.state?.initialPrompt;

    if (initialPrompt) {
      setDraftMessage(initialPrompt);
      setLastPrompt(initialPrompt);
    }
  }, [location.state]);

  const fetchRecommendations = async () => {
    setIsLoadingRecommendations(true);
    setRecommendationError("");

    try {
      const data = await apiRequest("/ai/recommendations");
      const candidateList = Array.isArray(data)
        ? data
        : Array.isArray(data?.recommendations)
          ? data.recommendations
          : [];

      const nextRecommendations = candidateList.slice(0, 5);
      setRecommendations(nextRecommendations);
      setRecommendationsLoaded(true);
    } catch (error) {
      console.error("Recommendations error:", error);
      setRecommendationError("BookShelf AI is temporarily unavailable.");
      setRecommendationsLoaded(true);
    } finally {
      setIsLoadingRecommendations(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const sendMessage = async (
    messageText = draftMessage,
    shouldResetInput = true,
  ) => {
    const trimmedMessage = messageText.trim();

    if (!trimmedMessage || isThinking) {
      return;
    }

    const userMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      text: trimmedMessage,
    };

    setConversation((previous) => [...previous, userMessage]);
    setLastPrompt(trimmedMessage);
    setChatError("");

    if (shouldResetInput) {
      setDraftMessage("");
    }

    setIsThinking(true);

    try {
      const data = await apiRequest("/ai/chat", {
        method: "POST",
        data: { message: trimmedMessage },
      });

      const assistantReply =
        data?.reply ||
        data?.response ||
        data?.message ||
        data?.answer ||
        "I’m here to help.";

      setConversation((previous) => [
        ...previous,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          text: assistantReply,
        },
      ]);
    } catch (error) {
      console.error("AI chat error:", error);
      setChatError("BookShelf AI is temporarily unavailable.");
      setConversation((previous) => [
        ...previous,
        {
          id: `${Date.now()}-assistant`,
          role: "assistant",
          text: "BookShelf AI is temporarily unavailable.",
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleSuggestionClick = (prompt) => {
    setDraftMessage(prompt);
    sendMessage(prompt);
  };

  const handleRetry = () => {
    if (lastPrompt) {
      sendMessage(lastPrompt, false);
      return;
    }

    fetchRecommendations();
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[1.75rem] border border-[#d5cab8] bg-[#fffdf8]/80 p-6 shadow-[0_20px_45px_rgba(40,31,23,0.06)] sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-[#8c6a26]">
              BookShelf AI
            </p>

            <h1 className="display-serif mt-3 text-4xl text-[#062f2a] sm:text-5xl lg:text-6xl">
              Your personal reading companion.
            </h1>

            <p className="mt-4 max-w-xl text-base leading-7 text-[#5a5047]">
              Discover your next read based on your reading journey.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchRecommendations}
            className="inline-flex items-center justify-center rounded-md bg-[#062f2a] px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#f7f0e5] transition hover:bg-[#0b4a3e]"
          >
            ✨ Find My Next Reads
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[1.75rem] border border-[#d5cab8] bg-[#fffdf8]/80 p-6 shadow-[0_20px_45px_rgba(40,31,23,0.06)] sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="display-serif text-3xl text-[#062f2a]">
              Recommended for You
            </h2>
            <span className="text-[0.7rem] uppercase tracking-[0.12em] text-[#756f67]">
              AI picks
            </span>
          </div>

          {recommendationError ? (
            <div className="mt-6 rounded-2xl border border-[#d8b2b2] bg-[#fff8f8] p-4">
              <p className="text-sm font-medium text-[#7d2d2d]">
                BookShelf AI is temporarily unavailable.
              </p>
              <button
                type="button"
                onClick={fetchRecommendations}
                className="mt-3 rounded-md border border-[#b8862d] bg-[#fffdf8] px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-[#062f2a] transition hover:bg-[#f5ebd2]"
              >
                Retry
              </button>
            </div>
          ) : isLoadingRecommendations ? (
            <div className="mt-6 flex items-center gap-3 rounded-2xl border border-[#d5cab8] bg-[#f8f3ea] p-4 text-sm text-[#5a5047]">
              <span className="flex h-2.5 w-2.5 animate-pulse rounded-full bg-[#b8862d]" />
              <span>BookShelf AI is thinking...</span>
            </div>
          ) : recommendations.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-[#b8ac98] bg-[#fffdf8] p-6 text-center">
              <h3 className="display-serif text-3xl text-[#062f2a]">
                Your reading profile is still growing.
              </h3>
              <p className="mt-3 text-sm leading-7 text-[#5a5047]">
                Add and rate a few books and BookShelf AI will learn your taste.
              </p>
              <button
                type="button"
                onClick={() => navigate("/books/add")}
                className="mt-5 rounded-md bg-[#062f2a] px-5 py-3 text-xs font-medium uppercase tracking-[0.12em] text-[#f7f0e5] transition hover:bg-[#0b4a3e]"
              >
                Add a Book
              </button>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              {recommendations.map((item, index) => (
                <article
                  key={`${item.title}-${index}`}
                  className="rounded-[1.25rem] border border-[#e7dcc9] bg-[#fffdf8] p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="display-serif text-3xl text-[#062f2a]">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-base text-[#5b534f]">
                        {item.author}
                      </p>
                    </div>

                    {item.confidence && (
                      <span className="rounded-full bg-[#f4e7c8] px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-[0.12em] text-[#72511c]">
                        {item.confidence}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {(Array.isArray(item.genres) ? item.genres : [item.genres])
                      .filter(Boolean)
                      .map((genre) => (
                        <span
                          key={`${item.title}-${genre}`}
                          className="rounded-full border border-[#d6b15a]/60 bg-[#f4e7c8] px-3 py-1.5 text-[0.58rem] font-medium uppercase tracking-[0.12em] text-[#72511c]"
                        >
                          {genre}
                        </span>
                      ))}
                  </div>

                  <p className="mt-4 text-base leading-7 text-[#5b534f] italic">
                    “
                    {item.reason ||
                      item.summary ||
                      "A strong match for your reading taste."}
                    ”
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <a
                      href={`/books/${item._id || ""}`}
                      className="rounded-md border border-[#b8862d] bg-[#fffdf8] px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-[#062f2a] transition hover:bg-[#f5ebd2]"
                    >
                      View
                    </a>
                    <button
                      type="button"
                      onClick={() => navigate("/books/add")}
                      className="rounded-md bg-[#062f2a] px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-[#f7f0e5] transition hover:bg-[#0b4a3e]"
                    >
                      Add to Library
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[1.75rem] border border-[#d5cab8] bg-[#fffdf8]/80 p-6 shadow-[0_20px_45px_rgba(40,31,23,0.06)] sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="display-serif text-3xl text-[#062f2a]">
              Conversation
            </h2>
            {isThinking && (
              <span className="text-xs uppercase tracking-[0.12em] text-[#8c6a26]">
                thinking
              </span>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleSuggestionClick(prompt)}
                className="rounded-full border border-[#d5cab8] bg-[#fffdf8] px-3 py-2 text-[0.62rem] font-medium uppercase tracking-[0.12em] text-[#062f2a] transition hover:border-[#b8862d] hover:bg-[#f5ebd2]"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="mt-6 space-y-4 rounded-[1.2rem] border border-[#e7dcc9] bg-[#f7f1e7] p-4">
            {conversation.length === 0 ? (
              <p className="text-sm text-[#5a5047]">
                Ask BookShelf AI about your next read.
              </p>
            ) : (
              conversation.map((entry) => (
                <div
                  key={entry.id}
                  className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-7 ${
                    entry.role === "user"
                      ? "ml-auto bg-[#062f2a] text-[#f7f0e5]"
                      : "bg-[#fffdf8] text-[#2c241d] border border-[#e7dcc9]"
                  }`}
                >
                  {entry.text}
                </div>
              ))
            )}

            {isThinking && (
              <div className="flex items-center gap-3 rounded-2xl border border-[#e7dcc9] bg-[#fffdf8] px-4 py-3 text-sm text-[#5a5047]">
                <span className="flex h-2 w-2 animate-pulse rounded-full bg-[#b8862d]" />
                <span>BookShelf AI is thinking...</span>
              </div>
            )}
          </div>

          {chatError && (
            <div className="mt-4 rounded-2xl border border-[#d8b2b2] bg-[#fff8f8] p-4">
              <p className="text-sm font-medium text-[#7d2d2d]">
                BookShelf AI is temporarily unavailable.
              </p>
              <button
                type="button"
                onClick={handleRetry}
                className="mt-3 rounded-md border border-[#b8862d] bg-[#fffdf8] px-4 py-2 text-xs font-medium uppercase tracking-[0.12em] text-[#062f2a] transition hover:bg-[#f5ebd2]"
              >
                Retry
              </button>
            </div>
          )}

          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
            className="mt-5"
          >
            <textarea
              value={draftMessage}
              onChange={(event) => setDraftMessage(event.target.value)}
              rows="3"
              placeholder="Ask BookShelf AI about your next read..."
              className="w-full resize-none rounded-xl border border-[#d5cab8] bg-[#fffdf8] px-4 py-3 text-sm text-[#2c241d] outline-none transition focus:border-[#b8862d] focus:ring-4 focus:ring-[#d6b15a]/20"
            />

            <div className="mt-3 flex items-center justify-between gap-3">
              <p className="text-xs text-[#756f67]">
                {draftMessage.length}/500
              </p>

              <button
                type="submit"
                disabled={isThinking || !draftMessage.trim()}
                className="rounded-md bg-[#062f2a] px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[#f7f0e5] transition hover:bg-[#0b4a3e] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isThinking ? "Thinking..." : "Send"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-8 rounded-[1.75rem] border border-[#d5cab8] bg-[#fffdf8]/80 p-6 text-center shadow-[0_20px_45px_rgba(40,31,23,0.06)] sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#8c6a26]">
          Reading companion
        </p>
        <p className="mt-2 text-base leading-7 text-[#5a5047]">
          Let your library history guide the next great read.
        </p>
      </div>
    </section>
  );
}

export default BookShelfAI;
