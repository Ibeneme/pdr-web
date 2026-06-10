import React from "react";

export const TermsAndConditions = () => {
  return (
    <main className="py-24 bg-white text-black">
      <div className="max-w-[700px] mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
            Legal
          </p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter">
            Terms & Conditions
          </h1>
          <p className="text-zinc-500 mt-6">Last updated: June 2026</p>
        </div>

        {/* Content */}
        <div className="space-y-12 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold mb-4 tracking-tight">
              1. Acceptance of Terms
            </h2>
            <p className="text-zinc-600">
              By accessing or using the Padiman Route platform, you acknowledge
              that you have read, understood, and agree to be bound by these
              Terms and Conditions. If you do not agree, please refrain from
              using our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 tracking-tight">
              2. User Eligibility
            </h2>
            <p className="text-zinc-600">
              You must be at least 18 years of age to use the Padiman Route
              platform. By using our service, you represent and warrant that you
              have the right, authority, and capacity to enter into this
              agreement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 tracking-tight">
              3. User Responsibilities
            </h2>
            <p className="text-zinc-600">
              Users are responsible for maintaining the confidentiality of their
              account credentials. You agree to accept responsibility for all
              activities that occur under your account. You must provide
              accurate, current, and complete information during the
              registration process.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 tracking-tight">
              4. Limitation of Liability
            </h2>
            <p className="text-zinc-600">
              Padiman Route provides the platform for community-driven
              logistics. We are not liable for any indirect, incidental,
              special, or consequential damages arising out of or in connection
              with your use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 tracking-tight">
              5. Termination
            </h2>
            <p className="text-zinc-600">
              We reserve the right to terminate or suspend access to our
              platform immediately, without prior notice or liability, for any
              reason whatsoever, including breach of these Terms.
            </p>
          </section>
        </div>

        {/* Contact Footer */}
        <div className="mt-20 pt-10 border-t border-zinc-100">
          <p className="text-zinc-400 text-sm">
            Questions regarding these Terms? Contact us at{" "}
            <a
              href="mailto:hello@padimanroute.com"
              className="text-black font-semibold underline"
            >
              hello@padimanroute.com
            </a>
          </p>
        </div>
      </div>
    </main>
  );
};
