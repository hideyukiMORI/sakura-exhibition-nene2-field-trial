# Security

This repository is an **open, education-oriented field-trial sandbox** for [NENE2](https://github.com/hideyukiMORI/NENE2). It must not hold production credentials; see `README.md` safety boundaries.

## Reporting a vulnerability

1. If **GitHub Private vulnerability reporting** is enabled for this repository, use **Security → Report a vulnerability** with reproduction steps and impact, without posting exploit details in public Issues first.
2. Otherwise, contact the maintainer through their GitHub profile or open a **high-level** Issue asking for a private channel; avoid attaching secrets, live URLs, or customer data.

## Out of scope

- Hypothetical attacks against unrelated production systems named only for domain inspiration in docs.
- Dependency advisories: use **Dependabot alerts** under the repository **Security** tab and routine `composer update` / `npm audit` on your checkout.

## Local development

- Never commit `.env` or real API keys. Use `.env.example` and environment variables only.
