# 📚 Complete Documentation Index - Autonomous QA Framework

This index helps you find the right document for your needs.

---

## 🎯 "I Want To..." Navigation

### "I want to test the website immediately"
→ [QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md)  
**Time**: 5 minutes reading + 20 minutes execution  
**Outcome**: First test results

---

### "I want to understand the full framework"
→ [AUTONOMOUS_QA_FRAMEWORK.md](AUTONOMOUS_QA_FRAMEWORK.md)  
**Time**: 15 minutes reading  
**Outcome**: Understanding of architecture, personas, scenarios

---

### "I want to use MultiOn (visual testing)"
1. Copy prompt from: [AGENT_EXECUTION_PROMPT.sh](AGENT_EXECUTION_PROMPT.sh)
2. Setup guide: [AGENT_INTEGRATION_GUIDE.md](docs/AGENT_INTEGRATION_GUIDE.md) Section 1
3. Copy prompts: [AGENT_PROMPTS_COPY_PASTE.md](docs/AGENT_PROMPTS_COPY_PASTE.md) "MultiOn Users"  
**Time**: 2 minutes setup + 20 minutes test execution

---

### "I want to use Zapier (weekly automation)"
1. Setup: [AGENT_INTEGRATION_GUIDE.md](docs/AGENT_INTEGRATION_GUIDE.md) Section 2
2. Prompts: [AGENT_PROMPTS_COPY_PASTE.md](docs/AGENT_PROMPTS_COPY_PASTE.md) "Zapier Users"
3. Full guide: [AUTONOMOUS_QA_FRAMEWORK.md](AUTONOMOUS_QA_FRAMEWORK.md) Section "Weekly Test Cycle"  
**Time**: 10 minutes setup (one-time) → Then fully automated

---

### "I want to use Playwright (immediate + CI/CD)"
1. Quick start: [QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md) STEP 4A
2. Full setup: [AGENT_INTEGRATION_GUIDE.md](docs/AGENT_INTEGRATION_GUIDE.md) Section 3
3. Code reference: [e2e/core-20-funnels.spec.ts](e2e/core-20-funnels.spec.ts)  
**Time**: 5 minutes setup + ~20 minutes execution

---

### "I want to use Claude / ChatGPT (ad-hoc testing)"
→ [AGENT_PROMPTS_COPY_PASTE.md](docs/AGENT_PROMPTS_COPY_PASTE.md) "ChatGPT / Claude" section  
**Time**: 1 minute + conversation time  
**Outcome**: Manual validation

---

### "I want to understand the test data"
1. Quick overview: [QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md) STEP 3
2. Detailed personas: [AGENT_EXECUTION_PROMPT.sh](AGENT_EXECUTION_PROMPT.sh)
3. Code reference: [src/lib/funnel-test-helpers.ts](src/lib/funnel-test-helpers.ts)

---

### "I want to see test results"
→ [AGENT_TEST_RESULTS_TEMPLATE.md](docs/AGENT_TEST_RESULTS_TEMPLATE.md)  
**Contains**: Full example results format with all sections filled out  
**Use**: As template for documenting your own test runs

---

### "I want to track results weekly"
→ [docs/FUNNEL_TEST_RESULTS.md](docs/FUNNEL_TEST_RESULTS.md)  
**Purpose**: Weekly tracking dashboard  
**Update**: Every Friday with latest test results

---

### "I want to understand what gets tested"
1. Quick summary: [AUTONOMOUS_QA_FRAMEWORK.md](AUTONOMOUS_QA_FRAMEWORK.md) "Test Scenarios"
2. Full protocol: [docs/FUNNEL_TESTING_PLAN.md](docs/FUNNEL_TESTING_PLAN.md)
3. Code implementation: [e2e/core-20-funnels.spec.ts](e2e/core-20-funnels.spec.ts)

---

### "I want to integrate with CI/CD"
→ [AGENT_INTEGRATION_GUIDE.md](docs/AGENT_INTEGRATION_GUIDE.md) Section 12  
**Includes**: GitHub Actions example, Playwright integration, auto-reporting

---

### "I want to send results to Slack"
→ [AGENT_INTEGRATION_GUIDE.md](docs/AGENT_INTEGRATION_GUIDE.md) Section 6  
**Setup**: 5 minutes, includes template message format

---

### "I want to store results in Airtable"
→ [AGENT_INTEGRATION_GUIDE.md](docs/AGENT_INTEGRATION_GUIDE.md) Section 5  
**Setup**: Schema definition + Zapier integration instructions

---

### "I want to understand severity ratings"
→ [AUTONOMOUS_QA_FRAMEWORK.md](AUTONOMOUS_QA_FRAMEWORK.md) "Issue Severity Guide"  
**Includes**: P0/P1/P2/P3 definitions + examples + actions

---

### "I want to know when we can go live"
→ [AUTONOMOUS_QA_FRAMEWORK.md](AUTONOMOUS_QA_FRAMEWORK.md) "Success Metrics"  
**Includes**: Readiness criteria, go-live checklist, metrics thresholds

---

### "I want to troubleshoot issues"
→ [AGENT_INTEGRATION_GUIDE.md](docs/AGENT_INTEGRATION_GUIDE.md) Section 11  
**Covers**:
- Agent stuck in loops
- Captcha blocking tests
- Screenshots not captured
- False positives
- Common fixes

---

### "I want to use a different agent platform"
→ [AGENT_PROMPTS_COPY_PASTE.md](docs/AGENT_PROMPTS_COPY_PASTE.md)  
**Supports**: 8 different platforms with copy-paste prompts for each

---

### "I want to learn about test personas"
→ [AGENT_EXECUTION_PROMPT.sh](AGENT_EXECUTION_PROMPT.sh)  
**Includes**: 5 personas (P1-P5) with detailed profiles and data

---

### "I want to create a custom test scenario"
1. Reference: [docs/FUNNEL_TESTING_PLAN.md](docs/FUNNEL_TESTING_PLAN.md)
2. Code template: [e2e/core-20-funnels.spec.ts](e2e/core-20-funnels.spec.ts)
3. Data helpers: [src/lib/funnel-test-helpers.ts](src/lib/funnel-test-helpers.ts)

---

## 📂 File-by-File Directory

### Core Framework Documents

| File | Purpose | Read Time |
|------|---------|-----------|
| [README_AUTONOMOUS_QA.md](README_AUTONOMOUS_QA.md) | Main entry point | 5 min |
| [QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md) | Step-by-step setup | 5 min |
| [AUTONOMOUS_QA_FRAMEWORK.md](AUTONOMOUS_QA_FRAMEWORK.md) | Complete guide | 15 min |
| [AGENT_EXECUTION_PROMPT.sh](AGENT_EXECUTION_PROMPT.sh) | Main agent prompt | Copy-paste |

### Integration & Setup

| File | Purpose | Read Time |
|------|---------|-----------|
| [docs/AGENT_INTEGRATION_GUIDE.md](docs/AGENT_INTEGRATION_GUIDE.md) | Platform setup (MultiOn, Zapier, etc.) | 20 min |
| [docs/AGENT_PROMPTS_COPY_PASTE.md](docs/AGENT_PROMPTS_COPY_PASTE.md) | Platform-specific prompts | Reference |
| [docs/AGENT_TEST_RESULTS_TEMPLATE.md](docs/AGENT_TEST_RESULTS_TEMPLATE.md) | Results documentation format | Reference |

### Testing & Tracking

| File | Purpose | Read Time |
|------|---------|-----------|
| [docs/FUNNEL_TESTING_PLAN.md](docs/FUNNEL_TESTING_PLAN.md) | Full testing protocol (100+ pages) | 60 min |
| [docs/FUNNEL_TEST_RESULTS.md](docs/FUNNEL_TEST_RESULTS.md) | Weekly tracking template | Update weekly |
| [docs/FUNNEL_QUICK_REFERENCE.md](docs/FUNNEL_QUICK_REFERENCE.md) | Quick reference guide | 10 min |

### Code Implementation

| File | Purpose | When to Use |
|------|---------|-------------|
| [e2e/core-20-funnels.spec.ts](e2e/core-20-funnels.spec.ts) | Playwright test suite (900+ lines) | Run tests |
| [src/lib/funnel-test-helpers.ts](src/lib/funnel-test-helpers.ts) | Test data, personas, selectors | Reference |

---

## 🎓 Learning Paths

### Path 1: Beginner (30 minutes)
Perfect for: First-time users, QA managers, non-technical stakeholders

1. Read: [README_AUTONOMOUS_QA.md](README_AUTONOMOUS_QA.md) (5 min)
2. Read: [QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md) Intro (3 min)
3. Run: `npm run test:e2e` (20 min)
4. View: Results in `test-reports/`
5. **Outcome**: You've run your first QA test ✅

---

### Path 2: Intermediate (1 hour)
Perfect for: QA engineers, product managers, technical leads

1. Read: [README_AUTONOMOUS_QA.md](README_AUTONOMOUS_QA.md) (5 min)
2. Read: [AUTONOMOUS_QA_FRAMEWORK.md](AUTONOMOUS_QA_FRAMEWORK.md) (15 min)
3. Choose platform: [QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md) STEP 1
4. Run first test: [QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md) STEP 4
5. Review results: [AGENT_TEST_RESULTS_TEMPLATE.md](docs/AGENT_TEST_RESULTS_TEMPLATE.md)
6. Document findings: [QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md) STEP 5
7. **Outcome**: Full QA workflow, ready to share results ✅

---

### Path 3: Advanced (2 hours)
Perfect for: DevOps engineers, automation specialists, developers

1. Read: All Beginner + Intermediate materials (40 min)
2. Study: [AGENT_INTEGRATION_GUIDE.md](docs/AGENT_INTEGRATION_GUIDE.md) (20 min)
3. Study: [e2e/core-20-funnels.spec.ts](e2e/core-20-funnels.spec.ts) code (20 min)
4. Configure: Zapier automation (10 min)
5. Integrate: With GitHub Actions (10 min)
6. Test: Full pipeline end-to-end (10 min)
7. **Outcome**: Fully automated, CI/CD integrated QA system ✅

---

## 📊 Quick Reference

### Test Scenarios at a Glance
- **Scenario A**: Private Move (Zurich → Zug)
- **Scenario B**: Cleaning Only (Bern)
- **Scenario C**: Multi-Service (Basel → Aarau with storage/assembly)
- **Scenario D**: Robustness & Mobile UX tests

**Coverage**: 40+ test cases across all critical paths

---

### Test Personas at a Glance
- **P1**: Max Test (Private move, 3.5 rooms)
- **P3**: Mia Test (Cleaning only, 2.5 rooms)
- **P4**: Franz Business (Business move, 8 workstations)

**Data**: All test includes "TEST" or "EXAMPLE" to prevent confusion

---

### Agent Platforms at a Glance
| Platform | Setup | Cost | Auto | Best For |
|----------|-------|------|------|----------|
| Playwright | 5 min | Free | GitHub Actions | Immediate |
| MultiOn | 2 min | Free | Manual | Visual |
| Zapier | 10 min | $20/mo | ✅ Yes | Weekly |
| Claude | 1 min | $20/mo | No | Ad-hoc |

---

## ✅ Quick Checklist

Getting started?

- [ ] I've read [README_AUTONOMOUS_QA.md](README_AUTONOMOUS_QA.md)
- [ ] I've chosen my agent platform
- [ ] I've reviewed [QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md)
- [ ] I've run my first test
- [ ] I've reviewed results
- [ ] I'm ready to fix issues and schedule ongoing tests

**Stuck?** → Check the "I want to..." section above

---

## 🔗 Cross-References

### For setup questions
- Start: [QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md)
- Details: [AGENT_INTEGRATION_GUIDE.md](docs/AGENT_INTEGRATION_GUIDE.md)

### For test execution
- Quick: [QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md) STEP 4
- Details: [AUTONOMOUS_QA_FRAMEWORK.md](AUTONOMOUS_QA_FRAMEWORK.md) "How to Run"

### For understanding results
- Template: [AGENT_TEST_RESULTS_TEMPLATE.md](docs/AGENT_TEST_RESULTS_TEMPLATE.md)
- Go-live decision: [AUTONOMOUS_QA_FRAMEWORK.md](AUTONOMOUS_QA_FRAMEWORK.md) "Success Metrics"

### For troubleshooting
- Fixes: [AGENT_INTEGRATION_GUIDE.md](docs/AGENT_INTEGRATION_GUIDE.md) Section 11
- FAQ: [AUTONOMOUS_QA_FRAMEWORK.md](AUTONOMOUS_QA_FRAMEWORK.md) "Support & Questions"

### For automation
- Weekly: [AUTONOMOUS_QA_FRAMEWORK.md](AUTONOMOUS_QA_FRAMEWORK.md) "Weekly Test Cycle"
- CI/CD: [AGENT_INTEGRATION_GUIDE.md](docs/AGENT_INTEGRATION_GUIDE.md) Section 12

---

## 📞 Need Help?

| Question | Answer Location |
|----------|-----------------|
| How do I get started? | [QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md) |
| What platform should I use? | [AUTONOMOUS_QA_FRAMEWORK.md](AUTONOMOUS_QA_FRAMEWORK.md) + [AGENT_PROMPTS_COPY_PASTE.md](docs/AGENT_PROMPTS_COPY_PASTE.md) |
| How do I set up Zapier? | [AGENT_INTEGRATION_GUIDE.md](docs/AGENT_INTEGRATION_GUIDE.md) Section 2 |
| What does P0/P1/P2/P3 mean? | [AUTONOMOUS_QA_FRAMEWORK.md](AUTONOMOUS_QA_FRAMEWORK.md) "Issue Severity Guide" |
| When can we go live? | [AUTONOMOUS_QA_FRAMEWORK.md](AUTONOMOUS_QA_FRAMEWORK.md) "Success Metrics" |
| What if I find a bug? | [QUICK_START_CHECKLIST.md](QUICK_START_CHECKLIST.md) STEP 7 |
| Can I create custom tests? | [AGENT_PROMPTS_COPY_PASTE.md](docs/AGENT_PROMPTS_COPY_PASTE.md) |
| How do I integrate with CI/CD? | [AGENT_INTEGRATION_GUIDE.md](docs/AGENT_INTEGRATION_GUIDE.md) Section 12 |

---

## 📈 Success Metrics

You're on track when:
- ✅ 4/4 scenarios pass
- ✅ Avg score ≥8/10
- ✅ P0 issues = 0
- ✅ Page load <5s
- ✅ Mobile score ≥8/10

See: [AUTONOMOUS_QA_FRAMEWORK.md](AUTONOMOUS_QA_FRAMEWORK.md) "Success Metrics"

---

**Version**: 1.0  
**Last Updated**: 2026-01-28  
**Status**: ✅ Production Ready

**Next Step**: Pick a learning path above or use the "I want to..." navigation
