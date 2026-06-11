

export const PrivacyPolicy = () => {
  return (
    <main className="py-24 bg-white text-black">
      <div className="max-w-[700px] mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
            Legal
          </p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter">
            Privacy Policy
          </h1>
          <p className="text-zinc-500 mt-6">Last updated: June 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-12 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold mb-4 tracking-tight">
              1. Data Collection
            </h2>
            <p className="text-zinc-600">
              At Padiman Route, we collect information you provide directly to
              us when you create an account, update your profile, or communicate
              with our support team.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 tracking-tight">
              2. Information Usage
            </h2>
            <p className="text-zinc-600">
              We use the data we collect to provide, maintain, and improve our
              logistics services, process transactions, and send you technical
              notices and support messages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 tracking-tight">
              3. Security
            </h2>
            <p className="text-zinc-600">
              We take reasonable measures to help protect information about you
              from loss, theft, misuse, and unauthorized access, disclosure,
              alteration, and destruction.
            </p>
          </section>
        </div>

        <div className="mt-20 pt-10 border-t border-zinc-100">
          <p className="text-zinc-400 text-sm">
            Have questions about this policy? Contact us at
            hello@padimanroute.com
          </p>
        </div>
      </div>
    </main>
  );
};
