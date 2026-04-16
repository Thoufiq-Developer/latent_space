
# 🌱 VAANI — Voice AI for Accessible Navigation & Need-based Intelligence (MVP)

> A proactive voice AI that doesn’t wait for help requests — it reaches out first.

---

## 💡 What is VAANI?

VAANI is an early-stage **MVP (Minimum Viable Product)** built to explore a simple but powerful idea:

👉 *What if AI could call people before they even realize they need help?*

Most systems today are reactive — they wait for users to search, click, or ask. But that assumption breaks down for millions of people who:

* Can’t read or write
* Don’t use smartphones
* Aren’t aware of available services

VAANI flips this model.

Instead of waiting, it **proactively calls users**, speaks in their language, and offers help based on their situation.

---

## 🚀 What Makes This MVP Different?

This MVP focuses on validating one core concept:

> **Memory-driven, proactive voice assistance for real-world problems**

Even in its early stage, VAANI demonstrates:

* 📞 **Outbound AI Calls**
  The system can initiate calls based on user context (not just respond)

* 🧠 **Life Memory (via Qdrant)**
  Instead of storing documents, it stores *user life events and behavior*

* 🌍 **Multilingual Voice Interaction**
  Designed for Indian languages and dialects

* ⚡ **Context-aware Conversations**
  Remembers past interactions and uses them naturally

---

## 🧪 Why This is an MVP

This version is intentionally minimal and built for **validation, not scale**.

It focuses on answering:

* Can AI proactively help users meaningfully?
* Does memory improve trust and usefulness?
* Can voice alone be enough (no app, no UI)?

### Current Limitations (Expected in MVP)

* Uses mock/demo data in some flows
* Limited real-world integrations (e.g., schemes, hospitals)
* Basic risk scoring logic
* Not production-ready (no full security, scaling, or monitoring)

---

## 🏗️ MVP Architecture Overview

This MVP combines a few key components:

* **Voice Layer (VAPI)**
  Handles calls, speech-to-text, and text-to-speech

* **Memory Layer (Qdrant)**
  Stores user interactions as semantic vectors (Life-Graph concept)

* **Backend (FastAPI)**
  Connects voice input → memory → LLM → response

* **LLM (GPT / Claude)**
  Generates contextual, human-like responses

---

## 🔄 How It Works (Simplified Flow)

1. User speaks (or receives a call)
2. Speech is converted to text
3. System retrieves relevant past interactions
4. AI generates a personalized response
5. New interaction is stored as memory

Over time:

> The system becomes more helpful the more you talk to it.

---

## 📞 MVP Highlight: Proactive Calls

The most important feature tested in this MVP:

* The system periodically checks:

  * Risk signals
  * Missed actions
  * Context changes

* If something needs attention:
  👉 It **initiates a call automatically**

This is the core experiment behind VAANI.

---

## 🎯 Use Cases (Explored in MVP)

* 🏥 Basic health reminders (e.g., missed medication)
* 🌾 Farming guidance (seasonal suggestions)
* 💰 Awareness of financial/government schemes
* 📚 Education support prompts

---

## 🖥️ Demo Interface (Frontend MVP)

A lightweight dashboard is included to simulate:

* Live call transcripts
* User profiles and memory
* Proactive call triggers
* Knowledge base preview

This is purely for demonstration and testing.

---

## 🌍 Vision Behind VAANI

This MVP is built around one belief:

> Technology shouldn’t require users to adapt — it should adapt to users.

VAANI aims to reach people who are typically excluded from digital systems by:

* Removing the need for apps
* Removing the need for literacy
* Using voice as the only interface

---

## ⚠️ Important Note

This is a **hackathon MVP**, not a finished product.

It is designed to:

* Demonstrate feasibility
* Showcase innovation
* Validate the proactive AI concept

---

## 🔮 What’s Next (Beyond MVP)

If developed further, VAANI could evolve into:

* Real-time integration with government databases
* Smarter risk prediction models
* Offline/low-network optimizations
* Scalable deployment across regions
* Deeper personalization and trust systems

