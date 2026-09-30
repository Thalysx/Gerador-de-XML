# Delta: ui-system

## MODIFIED Requirements

### Requirement: Result scroll lifecycle

Every result content replacement SHALL reset the internal scroll to zero immediately and after rendering. The result SHALL NOT receive programmatic focus or an animated outline after generation. Copying, downloading, resizing and manual reading SHALL preserve the current position.

#### Scenario: Generate two long results
- GIVEN the user has scrolled inside a long result
- WHEN another result is generated
- THEN the internal result position returns to zero after rendering
- AND the page position remains unchanged.

#### Scenario: Reformat or restore a result
- GIVEN the result was manually scrolled
- WHEN its content is reformatted or restored from history
- THEN the internal result position returns to zero immediately
- AND no animated outline is shown around the result.

### Requirement: Search placement

Search and category filtering SHALL appear in a shared horizontal region before the configuration/result workspace, SHALL respect the active environment and SHALL expose contextual clearing only while a query exists.

#### Scenario: Search the active environment
- GIVEN the user is viewing Dados cadastrais
- WHEN the user enters a search term
- THEN search and category are positioned above both configuration and result
- AND only matching generators available in the active environment are shown
- AND a named clear action is available in the field while text exists.

#### Scenario: Clear a generator query
- GIVEN the search field contains text
- WHEN the contextual clear action is activated
- THEN the query and category filter are reset
- AND the complete generator collection for the active environment is restored
- AND focus returns to the search field.

### Requirement: Full-page assistant

The AI assistant SHALL dedicate the central application area to empty state or conversation, SHALL keep suggestions immediately before the lower composer and SHALL group attachment, message, send, mode, mask and new-conversation controls inside that composer.

#### Scenario: Open the AI assistant
- GIVEN the FUTURE G shell is visible
- WHEN the user opens the AI assistant
- THEN the conversation uses the available content area without a redundant outer card
- AND no permanent controls or privacy drawer interrupt the conversation
- AND the unified composer remains in the lower conversation region.

## ADDED Requirements

### Requirement: Compact XML dropzone

The Editor XML SHALL expose one compact visual dropzone while retaining the existing upload behavior.

#### Scenario: Import XML files
- GIVEN no files are loaded in the Editor XML
- WHEN the import state is shown
- THEN exactly one dashed dropzone surface is visible
- AND its desktop width is bounded
- AND selection, multiple files, drag-and-drop, parsing and errors remain available.
