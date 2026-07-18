import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — EMO Learners" },
      { name: "description", content: "How EMO Learners collects, uses, and protects your personal data." },
      { property: "og:title", content: "Privacy Policy — EMO Learners" },
      { property: "og:description", content: "How EMO Learners collects, uses, and protects your personal data." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="relative px-4 pb-24 pt-16">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" />
        <div className="relative mx-auto max-w-3xl">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-primary">// Legal</span>
          <h1 className="mt-4 font-display text-4xl font-extrabold uppercase leading-[0.9] tracking-tighter md:text-6xl">
            Privacy <span className="italic text-primary">Policy</span>
          </h1>
          <p className="mt-3 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
            Last updated: June 20, 2026
          </p>

          <div className="mt-10 space-y-8 text-[15px] leading-relaxed text-muted-foreground">
            <p>
              Welcome to EMO Learners. We respect your privacy and are committed to protecting your personal data.
              This privacy policy will inform you as to how we look after your personal data when you visit our
              website and tell you about your privacy rights and how the law protects you.
            </p>

            <div>
              <h2 className="font-display text-xl font-extrabold uppercase text-foreground">1. Information We Collect</h2>
              <p className="mt-3">
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li><span className="text-foreground font-semibold">Identity Data</span> — first name, last name, username or similar identifier.</li>
                <li><span className="text-foreground font-semibold">Contact Data</span> — email address and telephone numbers.</li>
                <li><span className="text-foreground font-semibold">Technical Data</span> — IP address, browser type and version, time zone, OS and platform.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-xl font-extrabold uppercase text-foreground">2. How We Use Your Information</h2>
              <p className="mt-3">
                We will only use your personal data when the law allows us to. Most commonly:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>To provide and maintain our Service.</li>
                <li>To notify you about changes to our Service.</li>
                <li>To provide customer support.</li>
                <li>To gather analysis or valuable information so we can improve our platform.</li>
              </ul>
            </div>

            <div>
              <h2 className="font-display text-xl font-extrabold uppercase text-foreground">3. Third-Party Links</h2>
              <p className="mt-3">
                This website may include links to third-party websites, plug-ins and applications. Clicking on those
                links or enabling those connections may allow third parties to collect or share data about you. We do
                not control these third-party websites and are not responsible for their privacy statements.
              </p>
            </div>

            <div>
              <h2 className="font-display text-xl font-extrabold uppercase text-foreground">4. Contact Us</h2>
              <p className="mt-3">
                If you have any questions about this privacy policy or our privacy practices, please contact us:
              </p>
              <ul className="mt-3 space-y-2">
                <li>
                  Contact:{" "}
                  <Link to="/contact" className="text-primary hover:underline">
                    Use our contact form
                  </Link>
                </li>
                <li>
                  Telegram:{" "}
                  <a href="https://t.me/placeholder" target="_blank" rel="noreferrer" className="text-primary hover:underline">
                    @username
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
