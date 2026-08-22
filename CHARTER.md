# Project Charter

This is a high level description of the project. This should be updated by humans or by explicit direction to AI agent. All development should be performed in accordance with the guidance here, or flagged as a potential update and decision point.

# Problem Statement

When working with AI technologies, there are a large number of complex concepts and terms. For example, there is a difference between a model, a harness, a model provider and a model host, and many flavors of "open source" AI. The goal of this project is to make learning the AI stack easier for users by providing a reference for each specific term and an understanding of how they relate and combine with each other.

# Goals
- Develop an interactive website to help understand these concepts
- Providing single-page quick references and diagrams that can be shared and reused
- Relate the concepts to real-world products and services like Claude Code and OpenAI Codex
- Use the concepts with a fictional organization to help them be understood more concretely

# Implementation Notes
- Website should be statically generated, likely hosted on Github Pages
- Automation should be included to detect and where possible implement updates based on real-world changes
- Sources for all information should be cited
- Whenever possible, use existing industry standard terms and taxonomies rather than inventing new ones
- Given the complexity of the subject matter, it should be possible to zoom in and zoom out to varying levels of detail
- Because there are not well established taxonomies, our internal data structure should be a node graph with metadata such as tags, so that new concepts can easily be added without strong category constraints.

# Concepts
- Think of this field guide as similar to a bird watching book. You may see a bird in the wild and want to check the field guide to understand what you saw.
