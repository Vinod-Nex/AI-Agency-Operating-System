# Release Management & Semantic Versioning Strategy
## AI Agency Operating System (AgencyOS)

---

## 1. Semantic Versioning Specification (`MAJOR.MINOR.PATCH`)

- **MAJOR (`v1.0.0` -> `v2.0.0`)**: Incompatible API breaking changes or major database restructuring.
- **MINOR (`v1.0.0` -> `v1.1.0`)**: Backward-compatible new features (e.g. adding a new AI Proposal template).
- **PATCH (`v1.0.1` -> `v1.0.2`)**: Backward-compatible bug fixes and security patches.

---

## 2. Automated Git Tag & Release Workflow (`release.yml`)

```bash
# Tag creation command
git tag -a v1.0.0 -m "Release v1.0.0: Initial Enterprise Production Release"
git push origin v1.0.0
```
- **Automated Changelog Generation**: GitHub Actions parses Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`) to compose release release notes.
