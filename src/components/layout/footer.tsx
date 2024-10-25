import LogoText from "@/components/icons/logo-text";

export default function Footer() {
  return (
    <footer className="p-4 bg-card">
      <div className="container max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="https://jinx-team.vercel.app/"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
          <LogoText className="w-full h-24 mx-auto text-foreground" />
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
            <li>
              <a href="/" className="hover:underline me-4 md:me-6">
                Home
              </a>
            </li>
            <li>
              <a href="/blog" className="hover:underline me-4 md:me-6">
                Blog
              </a>
            </li>
            <li>
              <a href="/" className="hover:underline me-4 md:me-6">
                Impressum
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          University Chemnitz Planspiel Project 2024
        </span>
      </div>
    </footer>
  );
}