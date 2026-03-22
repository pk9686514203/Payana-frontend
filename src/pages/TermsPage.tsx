import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

export default function TermsPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">Terms &amp; Conditions</h1>
        <p className="text-sm text-muted-foreground mb-8">Namma Payana / Payana Bookings — last updated {new Date().getFullYear()}</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">1. Booking rules</h2>
            <p>
              Bookings are subject to availability, confirmation by the travel agency or vehicle owner, and accurate information
              you provide (including verified phone via OTP). Prices shown are indicative until confirmed on the booking record.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">2. Refund policy</h2>
            <p>
              Cancellations and refunds depend on the agency or operator you booked with and their policies. Payana Bookings
              facilitates connections; specific refund timelines and fees are communicated by the service provider. Contact support
              using the details in the footer for disputes.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">3. Payments</h2>
            <p>
              Online payments may be enabled in the future. Until then, payment terms are agreed directly between you and the
              agency or vehicle owner.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">4. Contact</h2>
            <p>
              Email:{" "}
              <a href="mailto:soaring.xofficial@gmail.com" className="text-secondary hover:underline">
                soaring.xofficial@gmail.com
              </a>
              <br />
              Phone: <a href="tel:9390071812" className="text-secondary hover:underline">+91 93900 71812</a>
              <br />
              Bengaluru, Karnataka, India
            </p>
          </section>
        </div>

        <p className="mt-10">
          <Link to="/" className="text-sm text-secondary font-medium hover:underline">
            ← Back to home
          </Link>
        </p>
      </div>
    </Layout>
  );
}
