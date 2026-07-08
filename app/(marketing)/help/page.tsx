
import Link from "next/link";

export default function HelpPage() {
  const faqs = [
    {
      q: "How do I get started with Geass?",
      a: "Sign up for an account, create your first workspace, and start adding tasks and projects!"
    },
    {
      q: "Can I use Geass offline?",
      a: "Yes! Geass stores data locally and syncs when you're back online."
    },
    {
      q: "What is the Pomodoro timer feature?",
      a: "It's a focus timer that helps you work in 25-minute bursts with short breaks in between."
    },
    {
      q: "How do workspaces work?",
      a: "Workspaces let you separate different areas of your life or work, each with their own tasks and projects."
    },
    {
      q: "Is my data secure?",
      a: "Yes, we use industry-standard security practices to protect your information."
    }
  ];

  return (
    <div className="min-h-screen py-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-400 hover:text-white mb-8 transition-colors">
          &larr; Back to Home
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Help Center</h1>
        <p className="text-sm text-neutral-500 mb-12">Find answers to common questions or get support.</p>

        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-[#0e0e10] border border-white/[0.08] rounded-2xl p-6">
              <h3 className="text-sm font-bold text-white mb-3">{faq.q}</h3>
              <p className="text-sm text-neutral-400">{faq.a}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-[#0e0e10] border border-white/[0.08] rounded-2xl p-6">
          <h3 className="text-sm font-bold text-white mb-3">Still need help?</h3>
          <p className="text-sm text-neutral-400 mb-4">Reach out to us on social media or GitHub for support.</p>
          <div className="flex gap-3">
            <a href="https://github.com/UserAdityaKhawale" target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#EF5A6F] hover:underline">GitHub</a>
            <a href="https://x.com/Workbyaditya" target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#EF5A6F] hover:underline">X (Twitter)</a>
            <a href="https://www.linkedin.com/in/aditya-r-khawale-1805352a9/" target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#EF5A6F] hover:underline">LinkedIn</a>
          </div>
        </div>
      </div>
    </div>
  );
}
