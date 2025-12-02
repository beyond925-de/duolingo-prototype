import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-white px-4 py-20">
        <div className="mx-auto max-w-4xl space-y-8 text-center">
          <h1 className="text-5xl font-bold leading-tight text-gray-900 md:text-6xl">
            Welcome to Your
            <span className="text-green-600"> New Project</span>
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600 md:text-2xl">
            A clean slate to build something amazing. Reuse components from the
            old-lingo project as you need them.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
            <Button size="lg" variant="secondary" asChild>
              <Link href="#features">Get Started</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href="/old-lingo">View Old Project</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900 md:text-4xl">
            What You Can Do
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border-2 border-gray-200 p-6 transition-colors hover:border-green-500">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Build Fresh
              </h3>
              <p className="text-gray-600">
                Start with a clean slate and build your vision from the ground
                up.
              </p>
            </div>

            <div className="rounded-lg border-2 border-gray-200 p-6 transition-colors hover:border-green-500">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Reuse Components
              </h3>
              <p className="text-gray-600">
                Import and adapt components from the old-lingo project as
                needed.
              </p>
            </div>

            <div className="rounded-lg border-2 border-gray-200 p-6 transition-colors hover:border-green-500">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">
                Fast Development
              </h3>
              <p className="text-gray-600">
                Leverage existing UI components and patterns to move quickly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-white to-slate-50 px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
            Ready to Build?
          </h2>
          <p className="mb-8 text-xl text-gray-600">
            Start creating your new project today.
          </p>
          <Button size="lg" variant="secondary">
            Get Started
          </Button>
        </div>
      </section>
    </main>
  );
}
