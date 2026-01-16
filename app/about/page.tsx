export default function AboutPage() {
  return (
    <div className="flex gap-8 w-full">
      <div className="hidden xl:block w-48 flex-shrink-0"></div>
      <article className="flex-1 max-w-5xl">
      <h1 className="text-5xl font-mono font-bold mb-10 pl-0 pr-0">About</h1>

      <section className="mb-10">
        <h2 className="text-3xl font-mono font-semibold mb-6 pl-0 pr-0">Overview</h2>
        <p className="mb-4 text-justify">
          Welcome to my technical blog. This is a space dedicated to sharing
          engineering insights, technical tutorials, and thoughts on software
          development.
        </p>
        <p className="text-justify">
          The content here focuses on practical engineering topics, code
          examples, and technical documentation in an engineering manual style.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-3xl font-mono font-semibold mb-6 pl-0 pr-0">Contact</h2>
        <ul className="space-y-3 text-base font-mono">
          <li>
            <strong className="font-semibold">Email:</strong>{' '}
            <a
              href="mailto:miguelagdasilva@gmail.com"
              className="text-foreground hover:text-[#8c6623] transition-colors"
            >
              miguelagdasilva@gmail.com
            </a>
          </li>
          <li>
            <strong className="font-semibold">GitHub:</strong>{' '}
            <a
              href="https://github.com/miguelagsilva"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-[#8c6623] transition-colors"
            >
              github.com/miguelagsilva
            </a>
          </li>
          <li>
            <strong className="font-semibold">LinkedIn:</strong>{' '}
            <a
              href="https://www.linkedin.com/in/miguelagsilva"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:text-[#8c6623] transition-colors"
            >
              linkedin.com/in/miguelagsilva
            </a>
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-3xl font-mono font-semibold mb-6 pl-0 pr-0">Technical Stack</h2>
        <p className="mb-4 text-lg font-mono">
          This blog is built with the folllowing technological stack:
        </p>
        <ul className="list-disc list-inside space-y-2 text-base font-mono">
          <li>Next.js 15 (App Router)</li>
          <li>React 19</li>
          <li>TypeScript</li>
          <li>Tailwind CSS</li>
          <li>Markdown for content</li>
        </ul>
        <p className="mb-4 text-lg font-mono">The code is available on my <a href="https://github.com/miguelagsilva/my-blog" target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-foreground/80 transition-colors">GitHub repository</a>.</p>
      </section>
    </article>
    </div>
  );
}
