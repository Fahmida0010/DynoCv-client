const faqs = [
  {
    id: 1,
    question: "How does the CV generation system work?",
    answer:
      "Our platform automatically creates a position-specific CV using your reusable profile, skills, projects and recruiter-defined templates.",
  },
  {
    id: 2,
    question: "Can I edit my generated CV later?",
    answer:
      "Yes. You can update your profile or projects anytime and regenerate or edit your CV whenever needed.",
  },
  {
    id: 3,
    question: "Can recruiters edit my profile?",
    answer:
      "No. Recruiters can only view your CVs in read-only mode. Only you and administrators can edit your profile.",
  },
  {
    id: 4,
    question: "Does the platform support auto-save?",
    answer:
      "Yes. Your profile changes are automatically saved every few seconds using optimistic locking.",
  },
];

const FAQ = () => {
  return (
    <>
      <section className="py-5 bg-light">

        <div className="container">

          <div className="text-center mb-5">

            <h2 className="fw-bold">
              Frequently Asked Questions
            </h2>

            <p className="text-muted">
              Find answers to the most common questions.
            </p>

          </div>

          <div
            className="accordion accordion-flush"
            id="faqAccordion"
          >

            {faqs.map((faq) => (

              <div
                className="accordion-item rounded shadow-sm mb-3"
                key={faq.id}
              >

                <h2 className="accordion-header">

                  <button
                    className={`accordion-button ${
                      faq.id !== 1 ? "collapsed" : ""
                    }`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#faq${faq.id}`}
                  >
                    {faq.question}
                  </button>

                </h2>

                <div
                  id={`faq${faq.id}`}
                  className={`accordion-collapse collapse ${
                    faq.id === 1 ? "show" : ""
                  }`}
                  data-bs-parent="#faqAccordion"
                >

                  <div className="accordion-body text-muted">
                    {faq.answer}
                  </div>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>
    </>
  );
};

export default FAQ;