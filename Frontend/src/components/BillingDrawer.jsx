import { Crown, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useSelector } from "react-redux";
import createOrder from "../features/createOrder.js";
import verifyPayment from "../features/verifyPayment.js";
import { createPortal } from "react-dom";

const plans = [
  { id: "starter", name: "Starter Plan", price: "₹199", credits: 500 },
  { id: "pro", name: "Pro Plan", price: "₹499", credits: 1000 },
];

const BillingDrawer = ({ open, onClose }) => {
  const { userData } = useSelector((state) => state.user);

  const credits = userData?.credits || 0;
  const totalCredits = userData?.totalCredits || 100;
  const percent = Math.min((credits / totalCredits) * 100, 100);

  const handleUpgrade = async (plan) => {

    try {
       const data = await createOrder(plan);
       const options = {
         key: import.meta.env.VITE_RAZORPAY_KEY_ID,
         amount: data?.order?.amount,
         currency: data?.order?.currency,
         name: "NexoraAI",
         description: `${data?.plan?.name} Plan`,
         order_id: data?.order?.id,
         handler: async(response) => {
           try {
             const data = await verifyPayment(response)
             console.log(data);
           } catch (error) {
             console.log(error)
           }
         },
         theme: {
           color:"#4F46E5"
         }
       };
       const razorpay = new window.Razorpay(options);
       razorpay.open();
    } catch (error) {
      console.log(error);
    }
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25 }}
            className="fixed right-0 top-0 z-50 h-dvh w-95 max-w-full bg-[#0f1117] border-l border-white/10 shadow-2xl overflow-y-auto
              [&::-webkit-scrollbar]:w-2
              [&::-webkit-scrollbar-track]:bg-white/5
              [&::-webkit-scrollbar-thumb]:bg-white/30
              [&::-webkit-scrollbar-thumb]:rounded-full
              hover:[&::-webkit-scrollbar-thumb]:bg-white/50"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-[#0f1117] border-b border-white/10">
              <div>
                <div className="text-white text-lg font-semibold">Billing</div>
                <div className="text-slate-400 text-sm">Plans & Credits</div>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer"
              >
                <X size={18} className="text-slate-300" />
              </button>
            </div>

            <div className="p-4">
              <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-slate-400 text-sm">Current Plan</p>
                    <h3 className="text-white text-xl font-bold capitalize">
                      {userData?.plan || "free"}
                    </h3>
                  </div>
                  <Crown className="text-yellow-400" />
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-xs text-slate-400 mb-2">
                    <span>Credits</span>
                    <span>
                      {credits}/{totalCredits}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-4 pb-4 space-y-3">
              <div className="rounded-xl border border-white/10 p-3">
                <h3 className="text-white font-semibold">Starter Plan</h3>
                <p className="text-indigo-400 text-xl font-bold mt-1">₹199</p>
                <p className="text-slate-400 text-sm">500 credits</p>
                <button
                  className="mt-3 w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 py-1.5 text-white cursor-pointer"
                  onClick={() => handleUpgrade("starter")}
                >
                  Upgrade
                </button>
              </div>

              <div className="rounded-xl border border-white/10 p-3">
                <h3 className="text-white font-semibold">Pro Plan</h3>
                <p className="text-indigo-400 text-xl font-bold mt-1">₹499</p>
                <p className="text-slate-400 text-sm">1000 credits</p>
                <button
                  className="mt-3 w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 py-1.5 text-white cursor-pointer"
                  onClick={() => handleUpgrade("pro")}
                >
                  Upgrade
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>,
     document.body
  );
};

export default BillingDrawer;