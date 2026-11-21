"use client";
import { useState, type FormEvent } from "react";
import { identity } from "../lib/site";
export default function ProjectBrief() {
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);
  function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const body = `Company: ${data.get("company")}\nContact: ${data.get("name")}\nEmail: ${data.get("email")}\n\nProblem and desired outcome:\n${data.get("problem")}\n\nBudget: ${data.get("budget")}\nTiming: ${data.get("timing")}\n`;
    setDraft(body);
    setCopied(false);
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }
  return (
    <form className="agency-brief" onSubmit={prepare}>
      <div className="agency-form-grid">
        <label>
          Your name
          <input name="name" required autoComplete="name" maxLength={100} />
        </label>
        <label>
          Work email
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            maxLength={200}
          />
        </label>
        <label>
          Company
          <input
            name="company"
            required
            autoComplete="organization"
            maxLength={150}
          />
        </label>
        <label>
          Indicative budget
          <select
            aria-label="Indicative budget"
            name="budget"
            required
            defaultValue=""
          >
            <option value="" disabled>
              Select a range
            </option>
            <option>€4,500–10,000</option>
            <option>€10,000–25,000</option>
            <option>€25,000–50,000</option>
            <option>€50,000+</option>
            <option>Not defined yet</option>
          </select>
        </label>
      </div>
      <label>
        What should change for the business?
        <textarea
          name="problem"
          rows={5}
          required
          maxLength={1800}
          placeholder="The current workflow, the outcome you want and what is getting in the way."
        />
      </label>
      <label>
        Timing and constraints
        <input
          name="timing"
          maxLength={250}
          placeholder="Target start, deadline, data or integration constraints"
        />
      </label>
      <p className="agency-small">
        This form prepares an email draft on your device. It does not submit or
        store your details. Please leave out confidential data.
      </p>
      <button className="agency-button" type="submit">
        Prepare my project brief
      </button>
      {draft && (
        <div className="agency-draft" role="status">
          <h2>Your brief is ready to review</h2>
          <p>
            Nothing has been sent. Review the text, then open your email app or
            copy it into an email to {identity.email}.
          </p>
          <textarea
            aria-label="Prepared project brief"
            rows={10}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <div className="agency-actions horizontal">
            <a
              className="agency-button"
              href={`mailto:${identity.email}?subject=${encodeURIComponent("Project brief — Hooman in the Loop")}&body=${encodeURIComponent(draft)}`}
            >
              Open email draft
            </a>
            <button className="agency-text-link" type="button" onClick={copy}>
              {copied ? "Copied" : "Copy brief"}
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
