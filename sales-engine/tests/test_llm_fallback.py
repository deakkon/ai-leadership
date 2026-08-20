"""LLM abstraction: template fallback and strict mode (no network)."""

from __future__ import annotations

import pytest

from sales_engine import llm


def test_complete_raises_when_unconfigured(monkeypatch):
    monkeypatch.delenv(llm.ENV_BASE_URL, raising=False)
    assert not llm.is_configured()
    with pytest.raises(llm.LlmUnavailableError):
        llm.complete("hello")


def test_generate_text_falls_back_to_template(monkeypatch):
    monkeypatch.delenv(llm.ENV_BASE_URL, raising=False)
    monkeypatch.delenv(llm.ENV_REQUIRE, raising=False)
    result = llm.generate_text("prompt", fallback_text="fallback body")
    assert result.engine == "template"
    assert result.text == "fallback body"
    assert "unavailable" in result.note


def test_generate_text_uses_llm_when_available(monkeypatch):
    monkeypatch.setenv(llm.ENV_BASE_URL, "http://localhost:11434/v1")
    monkeypatch.setenv(llm.ENV_REQUIRE, "0")

    def fake_complete(prompt, *, system=None, max_tokens=700):  # noqa: ARG001
        return "model-generated text"

    monkeypatch.setattr(llm, "complete", fake_complete)
    result = llm.generate_text("prompt", fallback_text="fallback")
    assert result.engine == "llm"
    assert result.text == "model-generated text"


def test_strict_mode_raises_instead_of_falling_back(monkeypatch):
    monkeypatch.setenv(llm.ENV_BASE_URL, "http://localhost:11434/v1")
    monkeypatch.setenv(llm.ENV_REQUIRE, "0")

    def failing_complete(prompt, *, system=None, max_tokens=700):  # noqa: ARG001
        raise llm.LlmUnavailableError("connection refused")

    monkeypatch.setattr(llm, "complete", failing_complete)
    with pytest.raises(llm.LlmUnavailableError):
        llm.generate_text("prompt", fallback_text="fallback", strict=True)


def test_require_env_forces_raise_even_without_strict(monkeypatch):
    monkeypatch.setenv(llm.ENV_BASE_URL, "http://localhost:11434/v1")
    monkeypatch.setenv(llm.ENV_REQUIRE, "1")

    def failing_complete(prompt, *, system=None, max_tokens=700):  # noqa: ARG001
        raise llm.LlmUnavailableError("connection refused")

    monkeypatch.setattr(llm, "complete", failing_complete)
    with pytest.raises(llm.LlmUnavailableError):
        llm.generate_text("prompt", fallback_text="fallback")


def test_configured_endpoint_defaults(monkeypatch):
    monkeypatch.delenv(llm.ENV_BASE_URL, raising=False)
    monkeypatch.delenv(llm.ENV_MODEL, raising=False)
    assert llm.configured_base_url() == "http://localhost:11434/v1"
    assert llm.configured_model() == "llama3.1"
