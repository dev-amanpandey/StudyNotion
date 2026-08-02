import { useState } from "react"
import { FiArrowUp, FiBookOpen, FiMessageCircle, FiZap } from "react-icons/fi"
import ReactMarkdown from "react-markdown"
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"
import { useSelector } from "react-redux"

import { sendTutorMessage } from "../services/operations/aiAssistantAPI"

const suggestedPrompts = [
  "Explain this topic simply",
  "Create a quick revision plan",
  "Quiz me on this lesson",
]

export default function AITutor() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const question = message.trim()
    if (!question || isLoading || !token) return

    const courseId = Array.isArray(user?.courses) ? user.courses[0]?._id || user.courses[0] : undefined
    setMessages((currentMessages) => [...currentMessages, { role: "user", content: question }])
    setMessage("")
    setIsLoading(true)

    try {
      const aiResponse = await sendTutorMessage(question, token, courseId)
      setMessages((currentMessages) => [...currentMessages, { role: "assistant", content: aiResponse }])
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || error?.message || "Unable to reach the AI tutor. Please try again."
      setMessages((currentMessages) => [
        ...currentMessages,
        { role: "assistant", content: errorMessage, isError: true },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-richblack-900 px-4 py-6 text-richblack-5 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-6.5rem)] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-richblack-700 bg-richblack-800 shadow-2xl shadow-black/20">
        <header className="flex items-center justify-between gap-4 border-b border-richblack-700 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-yellow-50 text-richblack-900">
              <FiZap className="text-xl" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold sm:text-xl">SAARTHI AI</h1>
              <p className="text-xs text-richblack-300 sm:text-sm">Your study companion, ready when you are</p>
            </div>
          </div>
          <span className="hidden rounded-full border border-caribbeangreen-400/40 bg-caribbeangreen-900/30 px-3 py-1 text-xs font-medium text-caribbeangreen-50 sm:block">
            Ready to help
          </span>
        </header>

        <section className="flex flex-1 overflow-y-auto px-4 py-8 sm:px-8">
          {messages.length === 0 ? (
            <div className="m-auto w-full max-w-xl text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-richblack-600 bg-richblack-700 text-yellow-50 shadow-lg">
                <FiMessageCircle className="text-3xl" aria-hidden="true" />
              </div>
              <h2 className="mt-6 text-2xl font-semibold text-richblack-5 sm:text-3xl">What would you like to learn?</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-richblack-300 sm:text-base">
                Ask for a clear explanation, practice questions, examples, or help planning your next study session.
              </p>

              <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => setMessage(prompt)}
                    className="rounded-xl border border-richblack-600 bg-richblack-700 p-4 text-sm font-medium text-richblack-50 transition hover:-translate-y-0.5 hover:border-yellow-50/70 hover:bg-richblack-600 focus:outline-none focus:ring-2 focus:ring-yellow-50"
                  >
                    <FiBookOpen className="mb-3 text-yellow-50" aria-hidden="true" />
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
              {messages.map((chatMessage, index) => (
                <article
                  key={`${chatMessage.role}-${index}`}
                  className={`max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-6 sm:max-w-[80%] sm:text-base ${
                    chatMessage.role === "user"
                      ? "ml-auto rounded-br-md bg-yellow-50 text-richblack-900"
                      : chatMessage.isError
                        ? "rounded-bl-md border border-pink-400/40 bg-pink-900/20 text-pink-25"
                        : "rounded-bl-md border border-richblack-600 bg-richblack-700 text-richblack-25"
                  }`}
                >
                  {chatMessage.role === "assistant" && !chatMessage.isError ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                      {chatMessage.content}
                    </ReactMarkdown>
                  ) : (
                    <p>{chatMessage.content}</p>
                  )}
                </article>
              ))}
              {isLoading && (
                <div className="flex w-fit items-center gap-2 rounded-2xl rounded-bl-md border border-richblack-600 bg-richblack-700 px-4 py-3 text-sm text-richblack-300" role="status">
                  <span className="flex gap-1" aria-hidden="true">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-yellow-50 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-yellow-50 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-yellow-50" />
                  </span>
                  SAARTHI AI is thinking...
                </div>
              )}
            </div>
          )}
        </section>

        <footer className="border-t border-richblack-700 bg-richblack-800/90 p-3 sm:p-4">
          <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-3xl items-end gap-2 rounded-2xl border border-richblack-600 bg-richblack-900 p-2 focus-within:border-yellow-50/80 focus-within:ring-1 focus-within:ring-yellow-50/80">
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault()
                  event.currentTarget.form?.requestSubmit()
                }
              }}
              placeholder="Ask SAARTHI AI anything..."
              rows={1}
              className="max-h-32 min-h-[44px] flex-1 resize-none bg-transparent px-3 py-3 text-sm text-richblack-5 outline-none placeholder:text-richblack-400 sm:text-base"
              aria-label="Message for SAARTHI AI"
            />
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-yellow-50 text-richblack-900 transition hover:bg-yellow-25 disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send message"
            >
              {isLoading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-richblack-900 border-t-transparent" /> : <FiArrowUp className="text-xl" />}
            </button>
          </form>
          <p className="mt-2 text-center text-[11px] text-richblack-400">AI can make mistakes. Review important information independently.</p>
        </footer>
      </div>
    </main>
  )
}
