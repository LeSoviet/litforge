# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Removed
- Outdated OCR functionality due to unmaintained react-native-mlkit-ocr library
- 121 sample story files reduced to 10 for better project management

### Changed
- Updated stories screen to reference only remaining 10 story files
- Cleaned up dependencies by removing react-native-mlkit-ocr
- Removed camera permissions from app.json
- Removed OCR-related navigation routes
- Removed OCR-related code from various components and services
- Updated README.md to remove OCR references

### Fixed
- Resolved runtime errors related to OCR module initialization failures
- Improved app stability by removing problematic dependencies

## [1.0.0] - 2025-08-30

### Added
- Initial release of LitForge - A complete document reading application built with React Native and Expo
- PDF and Markdown document reading capabilities
- Bookmark and note-taking features
- Progress tracking
- Dark/light theme support
- Multi-language support (Spanish, English, Portuguese)
