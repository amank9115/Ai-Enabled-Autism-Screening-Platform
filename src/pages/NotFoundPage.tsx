import { Link } from "react-router-dom"

import Container from "../components/common/Container"

const NotFoundPage = () => {
  return (
    <div className="bg-linear-to-br from-slate-50 via-white to-blue-50 py-20">
      <Container>
        <div className="rounded-3xl border border-slate-100 bg-white p-10 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
            404
          </p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">
            This page is still in care coordination.
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Let's return to the NEUROLYTIX-AI home experience.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 text-xs font-semibold uppercase tracking-[0.3em] text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5"
          >
            Back to landing
          </Link>
        </div>
      </Container>
    </div>
  )
}

export default NotFoundPage


