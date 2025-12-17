import Link from "next/link";

export const faqs = [
  {
    question: "How do I reset my password?",
    answer: (
      <>
        Go to the login page and click{" "}
        <Link
          href="/login"
          className="text-blue-600 hover:underline font-medium"
        >
          Forgot Password
        </Link>
        {`. Enter your email, and we'll send you a reset link.`}
      </>
    ),
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and Apple Pay/Google Pay in supported regions.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 5-7 business days. Express options are available at checkout.",
  },
  {
    question: "Do you offer refunds?",
    answer: (
      <>
        We offer full refunds within 30 days of purchase.{" "}
        <Link
          href="/contact"
          className="text-blue-600 hover:underline font-medium"
        >
          Contact us here
        </Link>{" "}
        for assistance.
      </>
    ),
  },
];
