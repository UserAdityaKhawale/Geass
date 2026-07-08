"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { CheckCircle, XCircle, ArrowRight, Loader2, CreditCard, Download, AlertTriangle } from "lucide-react";
import { useGeassStore } from "@/store/useGeassStore";
import { motion } from "framer-motion";

interface Invoice {
  id: string;
  amount: number;
  date: string;
  status: "paid" | "pending" | "failed";
  pdfUrl?: string;
}

const BillingPage = () => {
  const { user } = useUser();
  const { workspaces } = useGeassStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<"free" | "premium">("free");
  const [isLimitReached, setIsLimitReached] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) return;
      try {
        const res = await fetch("/api/user/settings");
        if (res.ok) {
          const data = await res.json();
          setSubscriptionTier(data.subscriptionTier);
        }
      } catch (error) {
        console.error("Failed to fetch subscription:", error);
      }
    };
    fetchSubscription();
  }, [user]);

  useEffect(() => {
    setIsLimitReached(workspaces.length >= (subscriptionTier === "free" ? 4 : 10));
  }, [workspaces, subscriptionTier]);

  useEffect(() => {
    const fetchInvoices = async () => {
      if (!user || subscriptionTier === "free") return;
      try {
        const res = await fetch("/api/stripe/invoices");
        if (res.ok) {
          const data = await res.json();
          setInvoices(data.invoices || []);
        }
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
      }
    };
    fetchInvoices();
  }, [user, subscriptionTier]);

  const handleUpgrade = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      const res = await fetch("/api/stripe/cancel", {
        method: "POST",
      });
      if (res.ok) {
        setSubscriptionTier("free");
        setShowCancelConfirm(false);
      }
    } catch (error) {
      console.error("Cancel failed:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">
          Billing & Plans
        </h1>
        <p className="text-neutral-400 text-sm">
          Manage your subscription and workspace limits
        </p>
      </motion.div>

      {/* Current Plan Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-[#0e0e10] border border-white/10 rounded-2xl p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Current Plan</h2>
            <p className="text-2xl font-black text-[#EF5A6F]">
              {subscriptionTier === "free" ? "Free" : "Premium"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-400 mb-1">Workspaces</p>
            <p className="text-lg font-bold text-white">
              {workspaces.length} / {subscriptionTier === "free" ? 4 : 10}
            </p>
          </div>
        </div>
        {isLimitReached && (
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <p className="text-yellow-400 text-sm font-semibold">
              ⚠️ You&apos;ve reached your workspace limit! Upgrade to Premium for more.
            </p>
          </div>
        )}

        {subscriptionTier === "premium" && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard size={16} className="text-neutral-400" />
              <span className="text-sm text-neutral-400">
                Your subscription is active and will renew automatically.
              </span>
            </div>
            <button
              onClick={() => setShowCancelConfirm(true)}
              className="text-sm text-red-400 hover:text-red-300 font-semibold transition-colors"
            >
              Cancel Subscription
            </button>
          </div>
        )}
      </motion.div>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowCancelConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#0e0e10] border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Cancel Subscription?</h3>
                <p className="text-sm text-neutral-400">This action cannot be undone</p>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="p-3 bg-white/5 rounded-xl">
                <p className="text-sm text-neutral-300">
                  After cancellation, you will lose access to premium features at the end of your billing period.
                </p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl">
                <p className="text-sm text-neutral-300">
                  Your workspace limit will be reduced from 10 to 4. Excess workspaces will be archived.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 py-2 px-4 rounded-xl border border-white/10 text-white text-sm font-bold hover:bg-white/5 transition-colors"
              >
                Keep Subscription
              </button>
              <button
                onClick={handleCancelSubscription}
                disabled={isCancelling}
                className="flex-1 py-2 px-4 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
              >
                {isCancelling ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  "Confirm Cancellation"
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Invoice History */}
      {subscriptionTier === "premium" && invoices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-[#0e0e10] border border-white/10 rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">Invoice History</h2>
          <div className="space-y-3">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                    <CreditCard size={18} className="text-neutral-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      ${invoice.amount.toFixed(2)}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {new Date(invoice.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-full ${
                      invoice.status === "paid"
                        ? "bg-green-500/20 text-green-400"
                        : invoice.status === "pending"
                        ? "bg-yellow-500/20 text-yellow-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                  {invoice.pdfUrl && (
                    <button
                      onClick={() => window.open(invoice.pdfUrl, "_blank")}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                      title="Download PDF"
                    >
                      <Download size={16} className="text-neutral-400" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Free Plan */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className={`p-6 rounded-2xl border ${
            subscriptionTier === "free"
              ? "bg-[#0e0e10] border-[#EF5A6F]/30"
              : "bg-[#0e0e10]/50 border-white/10"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Free</h3>
            {subscriptionTier === "free" && (
              <span className="px-3 py-1 bg-[#EF5A6F]/20 text-[#EF5A6F] text-xs font-bold rounded-full">
                Current Plan
              </span>
            )}
          </div>
          <div className="text-3xl font-black text-white mb-2">$0</div>
          <p className="text-neutral-500 text-sm mb-6">Forever free</p>

          <ul className="space-y-3 mb-6">
            {[
              "Up to 4 workspaces",
              "All core features",
              "Local data persistence",
            ].map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-neutral-300 text-sm">
                <CheckCircle size={16} className="text-green-500" />
                {feature}
              </li>
            ))}
            {[
              "Unlimited workspaces",
              "Priority support",
            ].map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-neutral-600 text-sm">
                <XCircle size={16} />
                {feature}
              </li>
            ))}
          </ul>

          {subscriptionTier === "free" && (
            <button
              disabled
              className="w-full py-2 px-4 rounded-xl bg-white/5 text-neutral-500 text-sm font-bold border border-white/10 cursor-not-allowed"
            >
              Current Plan
            </button>
          )}
        </motion.div>

        {/* Premium Plan */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className={`p-6 rounded-2xl border-2 ${
            subscriptionTier === "premium"
              ? "border-[#EF5A6F] bg-[#EF5A6F]/10"
              : "border-white/10 bg-[#0e0e10]"
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Premium</h3>
            {subscriptionTier === "premium" && (
              <span className="px-3 py-1 bg-[#EF5A6F]/20 text-[#EF5A6F] text-xs font-bold rounded-full">
                Current Plan
              </span>
            )}
          </div>
          <div className="text-3xl font-black text-white mb-1">$20</div>
          <p className="text-neutral-500 text-sm mb-6">per month</p>

          <ul className="space-y-3 mb-6">
            {[
              "Up to 10 workspaces",
              "All core features",
              "Local data persistence",
              "Priority support",
            ].map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-neutral-300 text-sm">
                <CheckCircle size={16} className="text-green-500" />
                {feature}
              </li>
            ))}
          </ul>

          {subscriptionTier === "premium" ? (
            <button
              disabled
              className="w-full py-2 px-4 rounded-xl bg-white/5 text-neutral-500 text-sm font-bold border border-white/10 cursor-not-allowed"
            >
              Current Plan
            </button>
          ) : (
            <button
              onClick={handleUpgrade}
              disabled={isLoading}
              className="w-full py-2 px-4 rounded-xl bg-[#EF5A6F] text-white text-sm font-bold hover:bg-[#d94a5f] transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Upgrade Now
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default BillingPage;
