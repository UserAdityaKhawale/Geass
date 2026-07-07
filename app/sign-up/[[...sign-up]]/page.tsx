import { SignUp } from "@clerk/nextjs";
import AuthLayout from "@/components/auth/AuthLayout";

export default function SignUpPage() {
  return (
    <AuthLayout>
      <div className="space-y-0.5 mb-4">
        <h2 className="text-2xl font-black tracking-tight text-white">
          Create your account.
        </h2>
        <p className="text-sm text-neutral-500 font-medium leading-relaxed">
          Join Geass and start turning plans into daily progress today.
        </p>
      </div>

      <SignUp
        signInUrl="/sign-in"
        forceRedirectUrl="/dashboard"
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "bg-transparent shadow-none border-none p-0 gap-0",
            cardBox: "shadow-none",
            header: "hidden",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            // Social buttons — wide pill style
            socialButtonsBlockButton:
              "w-full flex items-center justify-center gap-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] hover:border-white/15 text-white text-xs font-semibold py-2.5 transition-all duration-200",
            socialButtonsBlockButtonText: "text-xs font-semibold text-white",
            socialButtonsProviderIcon: "w-4 h-4",
            // Divider
            dividerRow: "my-4",
            dividerLine: "bg-white/[0.06]",
            dividerText: "text-neutral-600 text-[10px] uppercase tracking-widest",
            // Fields
            formFieldLabel: "text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1",
            formFieldInput:
              "w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-[#EF5A6F]/50 focus:bg-white/[0.06] focus:ring-2 focus:ring-[#EF5A6F]/10 transition-all duration-200",
            formFieldRow: "mb-3",
            // Submit button
            formButtonPrimary:
              "w-full mt-1 rounded-xl bg-gradient-to-r from-[#ff7e92] via-[#ef5a6f] to-[#d43d59] py-2.5 text-sm font-bold text-white shadow-[0_8px_32px_rgba(239,90,111,0.3)] hover:shadow-[0_12px_40px_rgba(239,90,111,0.45)] hover:opacity-95 transition-all duration-200 tracking-wide",
            // Footer links
            footer: "mt-4",
            footerAction: "text-center",
            footerActionText: "text-neutral-500 text-xs",
            footerActionLink: "text-[#EF5A6F] hover:text-[#ff8b98] font-semibold text-xs transition-colors",
            // Error messages
            formFieldErrorText: "text-[#EF5A6F] text-[11px] mt-1",
            alertText: "text-red-400 text-xs",
            // Internal card body
            main: "gap-4",
          },
          variables: {
            colorPrimary: "#EF5A6F",
            colorBackground: "#030303",
            borderRadius: "0.75rem",
            fontFamily: "var(--font-geist-sans)",
          },
        }}
      />
    </AuthLayout>
  );
}
