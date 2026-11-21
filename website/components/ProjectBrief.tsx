"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { identity } from "../lib/site";
type Errors = Partial<Record<"name" | "email" | "problem", string>>;
export default function ProjectBrief() {
  const [draft, setDraft] = useState("");
  const [feedback, setFeedback] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [preparedCount, setPreparedCount] = useState(0);
  const draftHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    if (preparedCount) draftHeading.current?.focus();
  }, [preparedCount]);
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) || "").trim();
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const nextErrors: Errors = {};
    if (!value("name")) nextErrors.name = "Enter your name.";
    if (!value("email") || !email.validity.valid)
      nextErrors.email = "Enter a valid email address.";
    if (!value("problem"))
      nextErrors.problem = "Describe the problem you want to solve.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setFeedback("Please check the highlighted fields.");
      const field = Object.keys(nextErrors)[0];
      (form.elements.namedItem(field) as HTMLElement)?.focus();
      return;
    }
    setDraft(
      `Company: ${value("company") || "Not provided"}\nContact: ${value("name")}\nEmail: ${value("email")}\n\nProblem and desired outcome:\n${value("problem")}\n\nBudget: ${value("budget") || "Not defined yet"}\nTiming: ${value("timing") || "To discuss"}\n`,
    );
    setFeedback(
      "Your draft is ready. Review it before opening your email app.",
    );
    setPreparedCount((count) => count + 1);
  }
  function editSource(event: FormEvent<HTMLFormElement>) {
    const target = event.target as HTMLInputElement;
    if (target.name in errors)
      setErrors((previous) => ({ ...previous, [target.name]: undefined }));
    if (target.name && draft) {
      setDraft("");
      setFeedback(
        "Your details changed. Prepare your brief again when you’re ready.",
      );
    }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(draft);
      setFeedback("Brief copied. Paste it into your email app.");
    } catch {
      setFeedback(
        "Copy is unavailable. Select the text in your brief and copy it manually.",
      );
    }
  }
  return (
    <form
      className="agency-brief"
      noValidate
      onSubmit={prepare}
      onInput={editSource}
    >
      <div className="agency-form-heading">
        <h2>Tell us about your project</h2>
        <p>Only your name, email and project description are required.</p>
      </div>
      <div className="agency-form-grid">
        <div className="agency-field">
          <label htmlFor="brief-name">
            Your name <span className="field-requirement">(required)</span>
          </label>
          <input
            id="brief-name"
            name="name"
            required
            autoComplete="name"
            maxLength={100}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "brief-name-error" : undefined}
          />
          {errors.name && (
            <span className="agency-field-error" id="brief-name-error">
              {errors.name}
            </span>
          )}
        </div>
        <div className="agency-field">
          <label htmlFor="brief-email">
            Work email <span className="field-requirement">(required)</span>
          </label>
          <input
            id="brief-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={200}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "brief-email-error" : undefined}
          />
          {errors.email && (
            <span className="agency-field-error" id="brief-email-error">
              {errors.email}
            </span>
          )}
        </div>
        <div className="agency-field">
          <label htmlFor="brief-company">
            Company <span className="field-requirement">(optional)</span>
          </label>
          <input
            id="brief-company"
            name="company"
            autoComplete="organization"
            maxLength={150}
          />
        </div>
        <div className="agency-field">
          <label htmlFor="brief-budget">Budget range (optional)</label>
          <select id="brief-budget" name="budget" defaultValue="">
            <option value="">Not defined yet</option>
            <option>€4,500–10,000</option>
            <option>€10,000–25,000</option>
            <option>€25,000–50,000</option>
            <option>€50,000+</option>
          </select>
        </div>
      </div>
      <div className="agency-field">
        <label htmlFor="brief-problem">
          What should change for the business?{" "}
          <span className="field-requirement">(required)</span>
        </label>
        <span className="agency-field-help" id="brief-problem-help">
          Describe the current workflow, your desired outcome and what is
          getting in the way.
        </span>
        <textarea
          id="brief-problem"
          name="problem"
          rows={5}
          required
          maxLength={1800}
          aria-invalid={!!errors.problem}
          aria-describedby={`brief-problem-help${errors.problem ? " brief-problem-error" : ""}`}
        />
        {errors.problem && (
          <span className="agency-field-error" id="brief-problem-error">
            {errors.problem}
          </span>
        )}
      </div>
      <div className="agency-field">
        <label htmlFor="brief-timing">
          Timing and constraints{" "}
          <span className="field-requirement">(optional)</span>
        </label>
        <input
          id="brief-timing"
          name="timing"
          maxLength={250}
          aria-describedby="brief-timing-help"
        />
        <span className="agency-field-help" id="brief-timing-help">
          For example, a target start, deadline or integration constraint.
        </span>
      </div>
      <p className="agency-small" id="brief-privacy">
        Your details stay on this device until you choose to send an email.
        Please leave out confidential data.
      </p>
      <button
        className="agency-button"
        type="submit"
        aria-describedby="brief-privacy"
      >
        Prepare my project brief
      </button>
      <p
        className="agency-feedback"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {feedback}
      </p>
      {draft && (
        <section className="agency-draft" aria-labelledby="draft-heading">
          <h2 id="draft-heading" ref={draftHeading} tabIndex={-1}>
            Review your project brief
          </h2>
          <p>
            Review or edit the text, then open your email app. Nothing is sent
            automatically.
          </p>
          <label htmlFor="prepared-brief">
            Prepared project brief
            <textarea
              id="prepared-brief"
              rows={10}
              value={draft}
              onChange={(event) => {
                setDraft(event.target.value);
                setFeedback("");
              }}
            />
          </label>
          <div className="agency-actions horizontal">
            <a
              className="agency-button"
              href={`mailto:${identity.email}?subject=${encodeURIComponent("Project brief — Hooman in the Loop")}&body=${encodeURIComponent(draft)}`}
            >
              Open email draft
            </a>
            <button className="agency-text-link" type="button" onClick={copy}>
              Copy brief
            </button>
          </div>
        </section>
      )}
    </form>
  );
}
