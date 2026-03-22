import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

export default function PrivacyPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Namma Payana / Payana Bookings — {new Date().getFullYear()}</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-lg font-semibold text-foreground">Data we collect</h2>
            <p>
              We collect information you provide when you register, book, or contact us — such as name, email, phone number,
              travel details, and (where applicable) agency or vehicle information. Phone numbers may be used for OTP verification
              and booking-related SMS when enabled on our servers.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">How we use data</h2>
            <p>
              Data is used to operate the platform: authentication, bookings, QR codes for your trip summary, and sharing necessary
              details with the agency or vehicle owner fulfilling your request. We do not sell your personal data.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">Storage &amp; security</h2>
            <p>
              Data is stored on secure infrastructure (including MongoDB Atlas). Passwords are hashed. Access to internal export
              tools is restricted to operators with a secret key — there is no public admin dashboard for end users.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">Your choices</h2>
            <p>
              You may request access or correction of your account data by contacting us. You can delete local session data by
              logging out and clearing browser storage.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-semibold text-foreground">Contact</h2>
            <p>
              Email:{" "}
              <a href="mailto:soaring.xofficial@gmail.com" className="text-secondary hover:underline">
                soaring.xofficial@gmail.com
              </a>
              <br />
              Phone: <a href="tel:9390071812" className="text-secondary hover:underline">+91 93900 71812</a>
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
