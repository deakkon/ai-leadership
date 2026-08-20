"""Local-LLM abstraction with deterministic template fallback.

Environment variables (all optional — the system works fully offline):

- SALES_ENGINE_LLM_BASE_URL  OpenAI-compatible endpoint, e.g. Ollama at
                             http://localhost:11434/v1  (default).
- SALES_ENGINE_LLM_MODEL     model name, e.g. llama3.1 / qwen2.5 (default).
- SALES_ENGINE_LLM_API_KEY   Bearer token (required for hosted providers such
                             as OpenAI/OpenRouter; default "ollama").
- SALES_ENGINE_LLM_TIMEOUT   request timeout in seconds (default 60).
- SALES_ENGINE_LLM_REQUIRE   "1" -> hard-fail instead of template fallback.

When no endpoint is configured, or the endpoint is unreachable, callers use
`generate_text(...)` which returns a deterministic template result tagged
engine="template". When a local model responds, the result is tagged engine="llm".
"""

from __future__ import annotations

import json
import os
import urllib.request
from dataclasses import dataclass

ENV_BASE_URL = "SALES_ENGINE_LLM_BASE_URL"
ENV_MODEL = "SALES_ENGINE_LLM_MODEL"
ENV_API_KEY = "SALES_ENGINE_LLM_API_KEY"
ENV_TIMEOUT = "SALES_ENGINE_LLM_TIMEOUT"
ENV_REQUIRE = "SALES_ENGINE_LLM_REQUIRE"

DEFAULT_BASE_URL = "http://localhost:11434/v1"
DEFAULT_MODEL = "llama3.1"
DEFAULT_TIMEOUT = 60


@dataclass(frozen=True)
class LLMResult:
    text: str
    engine: str  # "llm" | "template"
    note: str = ""


class LlmUnavailableError(RuntimeError):
    """Raised when the LLM is not configured or the request fails."""


def is_configured() -> bool:
    return bool(os.environ.get(ENV_BASE_URL))


def configured_base_url() -> str:
    return (os.environ.get(ENV_BASE_URL) or DEFAULT_BASE_URL).rstrip("/")


def configured_model() -> str:
    return os.environ.get(ENV_MODEL) or DEFAULT_MODEL


def configured_timeout() -> float:
    try:
        return float(os.environ.get(ENV_TIMEOUT) or DEFAULT_TIMEOUT)
    except ValueError:
        return float(DEFAULT_TIMEOUT)


def require_llm() -> bool:
    return os.environ.get(ENV_REQUIRE, "").strip().lower() in {"1", "true", "yes"}


def complete(prompt: str, *, system: str | None = None, max_tokens: int = 700) -> str:
    """Call the configured OpenAI-compatible /chat/completions endpoint."""
    if not is_configured():
        raise LlmUnavailableError(f"{ENV_BASE_URL} is not set; cannot call the LLM")
    messages: list[dict[str, str]] = []
    if system:
        messages.append({"role": "system", "content": system})
    messages.append({"role": "user", "content": prompt})
    payload = {
        "model": configured_model(),
        "messages": messages,
        "temperature": 0.4,
        "max_tokens": max_tokens,
    }
    request = urllib.request.Request(
        configured_base_url() + "/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    api_key = os.environ.get(ENV_API_KEY)
    if api_key:
        request.add_header("Authorization", f"Bearer {api_key}")
    try:
        with urllib.request.urlopen(request, timeout=configured_timeout()) as response:
            data = json.loads(response.read().decode("utf-8"))
    except Exception as exc:  # network / HTTP / timeout failures
        raise LlmUnavailableError(f"{exc}") from exc
    try:
        return str(data["choices"][0]["message"]["content"]).strip()
    except (KeyError, IndexError, TypeError) as exc:
        raise LlmUnavailableError(f"unexpected response shape: {str(data)[:200]}") from exc


def generate_text(
    prompt: str,
    *,
    system: str | None = None,
    fallback_text: str = "",
    strict: bool = False,
    max_tokens: int = 700,
) -> LLMResult:
    """Prefer the LLM; fall back to `fallback_text` when unavailable.

    `strict=True` (or SALES_ENGINE_LLM_REQUIRE=1) re-raises LlmUnavailableError
    instead of falling back, so callers can hard-fail when a model is mandatory.
    """
    try:
        text = complete(prompt, system=system, max_tokens=max_tokens)
        return LLMResult(text=text, engine="llm")
    except LlmUnavailableError as exc:
        if strict or require_llm():
            raise
        return LLMResult(
            text=fallback_text,
            engine="template",
            note=f"LLM unavailable ({exc}); used template fallback",
        )
