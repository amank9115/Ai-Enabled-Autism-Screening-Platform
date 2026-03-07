import { Link } from "react-router-dom"

const NotFoundPage = () => {
  return (
    <section className="mx-auto flex min-h-[70vh] max-w-4xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-semibold text-white">404</h1>
      <p className="mt-3 text-slate-300">The page you requested was not found.</p>
      <Link to="/" className="mt-6 rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">
        Back to Platform
      </Link>
    </section>
  )
}

export default NotFoundPage
